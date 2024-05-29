const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const test_data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const endpoints = require('../endpoints.json')
beforeAll(() => seed(test_data));
afterAll(() => db.end());

describe("Get/api/topics", () => {
    test("response with the status of 200 and an array of topics object", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveLength(3)
            body.map((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String),
                });
            });
        });
    });
    test("response with the status of 404 and Not found error msg when invalid route is provided", () => {
        return request(app)
        .get("/api/notARoute")
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe("Not Found");
        });
    });
})
describe("GET /api",()=>{
    test("responds with an object of all available API endpoints as objects",()=>{
        return request(app)
        .get('/api')
        .then((response)=>{
            expect(response.body.endpoints).toEqual(endpoints)
            expect(response.body.endpoints).toMatchObject(endpoints)
        })
    })
})