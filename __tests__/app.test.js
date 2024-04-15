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