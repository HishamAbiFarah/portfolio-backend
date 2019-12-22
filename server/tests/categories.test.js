const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Category } = require('./../models/category');

// run code before every test case
// wipe all categories because we assume categories.length will be 1 
beforeEach((done) => {
    Category.deleteMany({}).then(() => {
        done();
    });
});

describe('POST /categories', () => {

    it('should create a new category', (done) => {
        let name = 'test category 2'

        request(app)
            .post('/api/categories')
            .send({ name })
            .expect(200)
            .expect((res) => {
                expect(res.body.name).toBe(name);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Category.find().then((categories) => {
                    expect(categories.length).toBe(1);
                    expect(categories[0].name).toBe(name);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('shoud not create a new category with invalid body data', (done) => {
        request(app)
            .post('/api/categories')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Category.find().then((categories) => {
                    expect(categories.length).toBe(0);
                    done();
                });
            });
    });
});