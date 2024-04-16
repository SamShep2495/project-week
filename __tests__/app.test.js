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

    test("GET 200: Takes our sort_by and sorts the articles into that order along with the body being removed.", () => {
        return request(app)
        .get('/api/articles?sort_by=created_at')
        .expect(200)
        .then(({ body }) => {
            const { articles } = body
            expect(articles).toBeSortedBy('created_at')
        })
    })

})

describe("/api/articles/:article_id/comments", () => {

    test("GET 200: Responds with an array of the comments that that the given article_id", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
            const { comments } = body
            console.log('1.', comments[0])
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