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
