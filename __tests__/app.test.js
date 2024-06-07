const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");

beforeAll(() => seed(testData));
const endpoints = require('../endpoints.json')
afterAll(() => db.end());

describe("TOPICS",()=>{
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
    describe("GET All Topics - Invalid Topics Routes",()=>{
        test("response with the status of 404 and Invalid Path Typed. Did you mean /api/topics ? error msg when invalid route is provided", () => {
            return request(app)
            .get("/api/notARoute")
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Invalid Path Typed. Did you mean /api/topics ?");
            });
        });
    })
})
describe("GET /api",()=>{
    test("responds with an object of all available API endpoints as objects",()=>{
        return request(app)
        .get('/api')
        .then((response)=>{
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
    test("responds with status 200 and an articles array of article objects including total articles' comments, excluding body, sorted by date in descending order and without comment_count",()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toHaveLength(10)
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
    test("responds with status 200 an article object of id provided with comment_count",()=>{
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body})=>{
            expect(body.article).toHaveProperty('comment_count')
            expect(body.article).toEqual(expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number)
            }))
            expect(body.article).toEqual({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: 11
            })
        })
    })
})
describe("GET * (Invalid Articles Routes)",()=>{
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
            expect(body.comments).toHaveLength(10)
            expect(body.comments).toBeSortedBy("created_at",{descending: true})
            body.comments.map((comment)=>{
                expect(comment.article_id).toBe(1)
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
    test("responds with 400 and error msg Bad Request if the article id type is invalid",()=>{
        return request(app)
        .get('/api/articles/IamId/comments')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe("Bad Request");
        })
    })
})
describe("POST /api/articles/:article_id/comments",()=>{
    test("responds with status 201, posts the new comment and sends the new comment back to the client",()=>{
        const newComment = {
            username: "lurker",
            body: "I cant code when i am sleepy."
        }
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(201)
        .then(({body})=>{
            expect(body.comment.comment_id).toBe(19)
            expect(body.comment.article_id).toBe(2)
            expect(body.comment.author).toBe('lurker')
            expect(body.comment.votes).toBe(0)
            expect(body.comment.body).toBe('I cant code when i am sleepy.')
            expect(body.comment).toMatchObject({
                created_at: expect.any(String)
            })
        })
    })
    test("responds with status 404 and error message Not Found when username passed doesnt exist",()=>{
        const newComment = {
            username: "umerxz",
            body: "I cant code when i am sleepy."
        }
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe("Not Found");
        });
    })
    test("responds with status 404 and error message Not Found when article id passed doesnt exist",()=>{
        const newComment = {
            username: "lurker",
            body: "I cant code when i am sleepy."
        }
        return request(app)
        .post('/api/articles/1000/comments')
        .send(newComment)
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe("Not Found");
        });
    })
    test('responds with 400 and Bad Request error message when a required field is missing', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({ username: "lurker" })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    })
    test('responds with 400 and Bad Request error message when an invalid id is given', () => {
        return request(app)
        .post('/api/articles/IdHere/comments')
        .send({ username: "lurker", body: "I cant code when i am sleepy." })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    })
})
describe("PATCH /api/articles/:article_id",()=>{
    test("updates the article, responds with 200 status and the updated Article",()=>{
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes: -100})
        .expect(200)
        .then(({body}) => {
            expect(body.article).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })
        });
    })
    test('responds with status 400 and error message Bad Request when body passed has wrong data type', () => {
        return request(app)
        .patch('/api/articles/2')
        .send({ inc_votes: 'votes' })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    })
    test('responds with status 400 and error message Bad Request when fields/body are missing/malformed', () => {
        return request(app)
        .patch('/api/articles/2')
        .send({ })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    })
    test('responds with status 404 and error message Not Found when id passed does not exist', () => {
        return request(app)
        .patch('/api/articles/1000')
        .send({ inc_votes: 1 })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not Found');
        });
    })
    test('responds with status 400 and error message Bad Request when article id passed has invalid type', () => {
        return request(app)
        .patch('/api/articles/IamId')
        .send({ inc_votes: 1 })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    })
})
describe("DELETE /api/comments/:comment_id",()=>{
    test("responds with status 204 and sends an empty response back after deleting the comment",()=>{
        return request(app)
        .delete('/api/comments/2')
        .expect(204)
    })
    test("responds with status 404 and error message Not Found when an id does not exist",()=>{
        return request(app)
        .delete('/api/comments/999999')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Not Found");
        })
    })
    test("responds with status 400 and error message Bad Request when an invalid id given",()=>{
        return request(app)
        .delete('/api/comments/i_am_id')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request");
        })
    })
})
describe("GET /api/users",()=>{
    test("responds with status 200 and an array of objects of all users",()=>{
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body})=>{
            expect(body.users).toHaveLength(testData.userData.length)
            expect(body.users).toEqual(testData.userData)
            body.users.map((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String),
                });
            });
        })
    })
})
describe("GET * (Invalid Users Routes)",()=>{
    test("responds with a status of 404 and Not found error msg if an invalid route is provided", () => {
        return request(app)
        .get("/api/notUsersRoute")
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe("Not Found");
        });
    });
})
describe("GET /api/articles (topic query)",()=>{
    test("responds with status 200 and an array of articles objects filtered by the topics if given, else returns all articles",()=>{
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toHaveLength(10)
            body.articles.map((article)=>{
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    comment_count: expect.any(Number)
                })
            })
        })
    })
})
describe("GET /api/articles (sorting queries)",()=>{
    test("responds with status 200 and an array of articles objects sorted by article author in ascending order",()=>{
        return request(app)
        .get('/api/articles?sort_by=author&order=asc')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toHaveLength(10)
            expect(body.articles).toBeSortedBy('author')
        })
    })
    test("responds with status 200 and an array of articles objects sorted by default sort by created_at in ascending order when no sort by provided",()=>{
        return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toHaveLength(10)
            expect(body.articles).toBeSortedBy('created_at')
        })
    })
    test("responds with status 400 and error msg Bad Request if a query search is not allowed",()=>{
        return request(app)
        .get('/api/articles?sort_by=title&order=none')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        })
    })
    test("responds with status 200 and an array of articles objects sorted by their default values created_at in descending order, if query search given ",()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toHaveLength(10)
            expect(body.articles).toBeSortedBy('created_at',{descending:true})
        })
    })
})
describe("GET /api/users/:username",()=>{
    test("reponds with status 200 and an user object matching with the username passed",()=>{
        return request(app)
        .get('/api/users/lurker')
        .expect(200)
        .then(({body})=>{
            expect(body.user).toEqual({
                username: 'lurker',
                name: 'do_nothing',
                avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
            })
        })
    })
    test("responds with status 404 and error msg Not Found when username does not exist",()=>{
        return request(app)
        .get('/api/users/umerxz')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Not Found")
        })
    })
    test("responds with status 400 and error msg Bad Request when wrong type/wrong username format/wrong symbols passed for username",()=>{
        return request(app)
        .get('/api/users/1-as_d')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        })
    })
})
describe("PATCH /api/comments/:comment_id",()=>{
    test("responds with status 200 and an update comment object with votes increase by 1",()=>{
        return request(app)
        .patch('/api/comments/5')
        .send({ inc_votes : 1 })
        .expect(200)
        .then(({body})=>{
            expect(body.comment).toEqual({
                body: "I hate streaming noses",
                votes: 1,
                author: "icellusedkars",
                article_id: 1,
                created_at: '2020-11-03T21:00:00.000Z',
                comment_id: 5
            })
        })
    })
    test('responds with status 400 and error message Bad Request when body passed has wrong data type', () => {
        return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 'votes' })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    })
    test('responds with status 400 and error message Bad Request when fields/body are missing/malformed', () => {
        return request(app)
        .patch('/api/comments/1')
        .send({ })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    })
    test('responds with status 404 and error message Not Found when id passed does not exist', () => {
        return request(app)
        .patch('/api/comments/1000')
        .send({ inc_votes: 1 })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not Found');
        });
    })
    test('responds with status 400 and error message Bad Request when article id passed has invalid type', () => {
        return request(app)
        .patch('/api/comments/IamId')
        .send({ inc_votes: 1 })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    })
})
describe("POST /api/articles",()=>{
    test("responds with status 201 and new posted article object with id, votes, comments, created_at",()=>{
        const newArticle = {
            author: "lurker",
            title: "What Life",
            body: "Getting code logics doing random things",
            topic: "paper"
        }
        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(201)
        .then(({body})=>{
            expect(body.article.article_id).toBe(14)
            expect(body.article.title).toBe('What Life')
            expect(body.article.topic).toBe('paper')
            expect(body.article.author).toBe('lurker')
            expect(body.article.body).toBe('Getting code logics doing random things')
            expect(body.article.votes).toBe(0)
            expect(body.article.comment_count).toBe(0)
        })
    })
    test("responds with status 404 and an error Not Found when author or topic doesnt exist",()=>{
        const newArticle = {
            author: "lurker",
            title: "What Life",
            body: "Getting code logics doing random things",
            topic: "papers"
        }
        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Not Found")
        })
    })
    test("responds with status 400 and an error Bad Request when a required field is missing",()=>{
        const newArticle = {
            author: "lurker",
            body: "Getting code logics doing random things",
            topic: "papers"
        }
        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        })
    })
})
describe("GET /api/articles (pagination)",()=>{
    test("responds with status 200 and an array of articles objects, with 2 articles on page 2",()=>{
        return request(app)
        .get('/api/articles?limit=2&p=2')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toHaveLength(2)
            expect(body.articles).toBeSortedBy('created_at',{descending:true})
        })
    })
    test("responds with status 400 and error msg Bad Request if invalid page number given",()=>{
        return request(app)
        .get('/api/articles?limit=10&p=0')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        })
    })
    test("responds with status 400 and error msg Bad Request if invalid type is given",()=>{
        return request(app)
        .get('/api/articles?limit=asd&p=1')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        })
    })
    test("responds with status 200 and an array of articles objects, with a default value of 10 articles per page-1 if no limit is given",()=>{
        return request(app)
        .get('/api/articles?&p=1')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toHaveLength(10)
            expect(body.articles).toBeSortedBy('created_at',{descending:true})
        })
    })
})
describe("GET /api/articles/:article_id/comments (pagination)",()=>{
    test("responds with status 200 and an array of that articles comments objects, with 2 articles on page 2",()=>{
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body})=>{
            expect(body.comments).toBeSortedBy('created_at',{descending:true})
            body.comments.map((comment)=>{
                expect(comment.article_id).toBe(1)
                expect(comment).toMatchObject({
                    article_id: expect.any(Number),
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    votes: expect.any(Number),
                    author: expect.any(String),
                })
            })
        })
    })
    test("responds with status 400 and error msg Bad Request if invalid page number given",()=>{
        return request(app)
        .get('/api/articles/1/comments?limit=10&p=0')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        })
    })
    test("responds with status 400 and error msg Bad Request if invalid type limit or page is given",()=>{
        return request(app)
        .get('/api/articles/1/comments?limit=asd&p=1')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        })
    })
    test("responds with status 400 and error msg Bad Request if invalid type id is given",()=>{
        return request(app)
        .get('/api/articles/ID/comments?limit=asd&p=1')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        })
    })
    test("responds with status 404 and error msg Not Found if id doesnt exist",()=>{
        return request(app)
        .get('/api/articles/99999/comments?limit=1&p=1')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Not Found")
        })
    })
})
describe("POST /api/topics",()=>{
    test("responds with status 201, posts the new topic and sends the new topic back to the client",()=>{
        const newTopics = {
            slug: "topic name here",
            description: "description here"
        }
        return request(app)
        .post('/api/topics')
        .send(newTopics)
        .expect(201)
        .then(({body})=>{
            expect(body.topic.slug).toBe("topic name here")
            expect(body.topic.description).toBe("description here")
        })
    })
    test('responds with 400 and Bad Request error message when a required field Primary Key is missing', () => {
        return request(app)
        .post('/api/topics')
        .send({ description: "description here" })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    })
    test('responds with 400 and Bad Request error message when an wrong type is given', () => {
        return request(app)
        .post('/api/topics')
        .send({ slug: 1231, description: 23 })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    })
    test('responds with 403 and Already Exists message when an existing ', () => {
        return request(app)
        .post('/api/topics')
        .send({ slug: "mitch", description: "description" })
        .expect(403)
        .then((response) => {
            expect(response.body.msg).toBe('Already Exists');
        });
    })
})
describe("DELETE /api/articles/:article_id",()=>{
    test("responds with status 204 and an empty sends an empty response back",()=>{
        return request(app)
        .delete('/api/articles/1')
        .expect(204)
    })
    test("responds with status 404 and error msg Not Found when id does not exist",()=>{
        return request(app)
        .delete('/api/articles/999999')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Not Found")
        })
    })
    test("responds with status 400 and error msg Bad Request when id passed of wrong type",()=>{
        return request(app)
        .delete('/api/articles/IdHere')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        })
    })
})