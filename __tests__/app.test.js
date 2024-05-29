const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");

beforeAll(() => seed(testData));
const endpoints = require('../endpoints.json')
afterAll(() => db.end());

describe("Get/api/topics", () => {
    test("response with the status of 200 and an array of topics object", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(body.topics).toHaveLength(3)
            body.topics.map((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String),
                });
            });
        });
    });
})
describe("* - Invalid Routes",()=>{
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
describe("GET /api/articles/:article_id",()=>{
    test("responds with status 200 an article object of id provided",()=>{
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body})=>{
            expect(body.article.author).toBe('butter_bridge')
            expect(body.article.title).toBe('Living in the shadow of a great man')
            expect(body.article.article_id).toBe(1)
            expect(body.article.body).toBe('I find this existence challenging')
            expect(body.article.topic).toBe('mitch')
            expect(body.article.created_at).toBe('2020-07-09T20:11:00.000Z')
            expect(body.article.votes).toBe(100)
            expect(body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
        })
    })
    test('responds with status 404 and error message when given a valid but non-existent id', () => {
        return request(app)
        .get('/api/articles/9999999')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not Found');
        });
    });
    test('responds with status 400 sends an error message Bad Request when given an invalid id', () => {
        return request(app)
        .get('/api/articles/not-a-article')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
})
describe("GET /api/articles",()=>{
    test("responds with status 200 and an articles array of article objects including total articles' comments, excluding body",()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toHaveLength(13)
            expect(body.articles).toBeSortedBy("created_at",{descending: true})
            body.articles.map((article)=>{
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    comment_count: expect.any(Number),
                })
            })
        })
    })
})
describe("GET * (Invalid Routes)",()=>{
    test("responds with a status of 404 and Not found error msg if an invalid route is provided", () => {
        return request(app)
        .get("/api/notAnArticleRoute")
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe("Not Found");
        });
    });
})
describe("GET /api/articles/:article_id/comments",()=>{
    test("responds with 200 and an array of comments for the given article_id with each comments details, provided the id should be valid, existing and having comments",()=>{
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body})=>{
            expect(body.comments).toHaveLength(11)
            expect(body.comments).toBeSortedBy("created_at",{descending: true})
            body.comments.map((comment)=>{
                expect(comment).toMatchObject({
                    article_id: expect.any(Number),
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                })
            })
        })
    })
    test("responds with 200 and an empty array, provided the id should be valid, existing but having no comments",()=>{
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body})=>{
            expect(body.comments).toHaveLength(0)
            expect(body.comments).toEqual([])
        })
    })
    test("responds with 404 and error msg Not Found if the article does not exist",()=>{
        return request(app)
        .get('/api/articles/1000/comments')
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe("Not Found");
        });
    })
})