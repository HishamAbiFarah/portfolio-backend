const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Skill } = require('./../models/skill');


beforeEach((done) => {
    Skill.deleteMany({}).then(() => {
        done();
    });
});

describe('POST /skills', () => {

    it('should create a new skill', (done) => {
        let name = 'test skill'

        request(app)
            .post('/api/skills')
            .send({ name })
            .expect(200)
            .expect((res) => {
                expect(res.body.name).toBe(name);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Skill.find().then((skills) => {
                    expect(skills.length).toBe(1);
                    expect(skills[0].name).toBe(name);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('shoud not create a new skill with invalid body data', (done) => {
        request(app)
            .post('/api/skills')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Skill.find().then((skills) => {
                    expect(skills.length).toBe(0);
                    done();
                });
            });
    });
});