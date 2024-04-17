const request = require('supertest')
const app = require('../app')
const db = require("../db/connection.js")
const data = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')


afterAll(() => {
    db.end();
});

beforeEach(()=> {
    return seed(data);
});

describe('/api/topics', ()=> {

    test('GET 200: responds with status code 200.', () => {
        return request(app).get('/api/topics').expect(200)
    });

    test('GET 200: Responds with an array of topic objects.', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                const { topics } = body;
                expect(topics.length).toBe(3);
                topics.forEach(element => {
                    expect(typeof element.slug).toBe('string');
                    expect(typeof element.description).toBe('string');
                });
            });
    });
});

describe('/api', () => {

    test('GET 200: REsponds with an object of all the different endpoints.', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
            const APIS = body.apis
            for(let key in APIS) {
                expect(typeof APIS[key]).toBe('object')
            }
        })
    })

})

describe("/api/articles/:article_id", ()=> {

    test("GET 200: Responds with a specified article depends on the id input,", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
            const article = body[0]
            expect(article.article_id).toBe(1)
            expect(article.title).toBe("Living in the shadow of a great man")
            expect(article.topic).toBe("mitch")
            expect(article.author).toBe("butter_bridge")
            expect(article.body).toBe("I find this existence challenging")
            expect(article.created_at).toBe("2020-07-09T20:11:00.000Z")
            expect(article.votes).toBe(100)
            expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
        });
    });

    test("GET 400: Responds with an error when we pass through an id number that doesn't exist", () => {
        return request(app)
            .get("/api/articles/99")
            .expect(400)
            .then(({ body }) => {
                const { message } = body
                expect(message).toBe('invalid query value')
            })
    })

});

describe("/api/articles", () => {

    test("GET 200: Responds with an array of articles objects.", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles.length).toBe(13);
                articles.forEach((article) => {
                    expect(typeof article.article_id).toBe('number')
                    expect(typeof article.title).toBe('string')
                    expect(typeof article.topic).toBe('string')
                    expect(typeof article.author).toBe('string')
                    expect(typeof article.created_at).toBe('string')
                    expect(typeof article.votes).toBe('number')
                    expect(typeof article.article_img_url).toBe('string')
                })
            })
    })

    test("GET 400: Responds with a status code of 400 and a message when we pass through an invalid get request.", () => {
        return request(app)
        .get("/api/article")
        .expect(404)
        .then(({ body }) => {
            const { message } = body
            expect(message).toBe('Invalid endpoint')
        })
    })

    test("GET 200: Takes our sort_by and sorts the articles into that order along with the body being removed.", () => {
        return request(app)
        .get('/api/articles?sort_by=created_at')
        .expect(200)
        .then(({ body }) => {
            const { articles } = body
            expect(articles).toBeSortedBy('created_at')
        })
    })

    test("GET 200: REsponds with an array of object that have the topic as cat.", () => {
        return request(app)
        .get('/api/articles?filter_by_topic=cats')
        .expect(200)
        .then(({ body }) => {
            const { specificTopic } = body
            expect(specificTopic).toBeSortedBy('created_at')
            expect(specificTopic.length).toBe(1)
        })
    })

    test("GET 400: Responds with a status code of 400 and an error message when we pass through an invalid topic", () => {
        return request(app)
        .get('/api/articles?filter_by_topic=dogs')
        .expect(400)
        .then(({ body }) => {
            const { message } = body
            expect(message).toBe('Invalid topic')
        })
    })

})

describe("GET /api/articles/:article_id/comments", () => {

    test("GET 200: Responds with an array of the comments that that the given article_id", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
            const { comments } = body
            expect(comments.length).toBe(11)
            expect(comments).toBeSortedBy('created_at')
            expect(comments[0].comment_id).toBe(9)
            expect(comments[0].body).toBe("Superficially charming")
            expect(comments[0].article_id).toBe(1)
            expect(comments[0].author).toBe("icellusedkars")
            expect(comments[0].votes).toBe(0)
            expect(comments[0].created_at).toBe('2020-01-01T03:08:00.000Z')
        })
    })

    test("GET 400: Responds with an error when we pass through an id number that doesn't exist", () => {
        return request(app)
            .get("/api/articles/99/comments")
            .expect(400)
            .then(({ body }) => {
                const { message } = body
                expect(message).toBe('invalid query value')
            })
    })
})

describe("POST /api/articles/:article_id/comments", () => {

    test("POST 201: Responds with a new comment", () => {

        const newComment = {
            username: 'icellusedkars',
            body: "This is the greatest article I've ever seen!"
        }

        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body
                expect(comment.comment_id).toBe(19)
                expect(comment.body).toBe("This is the greatest article I've ever seen!")
                expect(comment.article_id).toBe(1)
                expect(comment.author).toBe('icellusedkars')
                expect(comment.votes).toBe(0)
                expect(typeof comment.created_at).toBe('string')
                
            })
    })

    // test("POST 400: Responds with an error when we pass through an empty comment", () => {
        
    //     const newComment = {
    //         username: 'icellusedkars',
    //         body: "This is the greatest article I've ever seen!"
    //     }
        
    //     return request(app)
    //         .post("/api/articles/99/comments")
    //         .send(newComment)
    //         .expect(400)
    //         .then(({ body }) => {
    //             console.log('6.', body)
    //             const { message } = body
    //             expect(message).toBe('No comment to add')
    //         })
    // })

})

describe("PATCH /api/articles/:article_id", () => {

    test("PATCH 200: Responds with an article with it's votes patched.", () => {
        const newVotes = {
             inc_votes: 1
        };
        return request (app)
        .patch("/api/articles/1")
        .send(newVotes)
        .expect(200)
        .then(({ body }) => {
            expect(body.articles[0]).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 101,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              },)
        })
    })

    test("PATCH 200: Responds with an article with it's votes patched.", () => {
        const newVotes = {
             inc_votes: -50
        };
        return request (app)
        .patch("/api/articles/1")
        .send(newVotes)
        .expect(200)
        .then(({ body }) => {
            expect(body.articles[0]).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 50,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              },)
        })
    })

    test("GET 400: Responds with an error when we pass through an id number that doesn't exist", () => {
        return request(app)
            .patch("/api/articles/99")
            .expect(400)
            .then(({ body }) => {
                const { message } = body
                expect(message).toBe('invalid query value')
            })
    })
})

describe("DELETE /api/comments/:comment_id", () => {

    test("DELETE 204: Responds with status code of 204 with no content as we've deleted all the content with this comment_id.", () => {
        return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({body}) => {
            expect(Object.keys(body).length).toBe(0)
        })
    })

    test("DELETE 400: Responds with an error message when passed through a comment id that doesn't exist.", () => {
        return request(app)
        .delete("/api/comments/99")
        .expect(400)
        .then(({ body }) => {
            const { message } = body
            expect(message).toBe('invalid query value')
        })
    })
})

describe("GET /api/users", () => {

    test("GET 200: Responds with a status code of 200 along with the content of the user file.", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
            .then(({ body }) => {
                const { users } = body;
                expect(users.length).toBe(4);
                users.forEach((user) => {
                    expect(typeof user.username).toBe('string')
                    expect(typeof user.name).toBe('string')
                    expect(typeof user.avatar_url).toBe('string')
                })
            })
    })

    test("GET 400: Responds with a status code of 400 and a message when we pass through an invalid get request.", () => {
        return request(app)
        .get("/api/userss")
        .expect(404)
        .then(({ body }) => {
            const { message } = body
            expect(message).toBe('Invalid endpoint')
        })
    })

})
