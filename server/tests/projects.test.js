const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Project } = require('./../models/project');


// beforeEach((done) => {
//     Project.deleteMany({}).then(() => {
//         done();
//     });
// });

// describe('POST /projects', () => {

//     it('should create a new project', (done) => {

//         // let project = {
//         //     title: "project title",
//         //     category: {
//         //         _id: "category id",
//         //         name: "category name"
//         //     },
//         //     numberOfUpdates: 0
//         // };
//         let project = {
//             title: 'req.body.title',
//             tags: ['tag1' , 'tag2'],
//             category: {
//                 _id: 'category._id',
//                 name: 'category.name'
//             }
//         };

//         request(app)
//             .post('/api/projects')
//             .send(project)
//             .expect(200)
//             .expect((res) => {
//                 // expect(res.body.title).toBe(project.title);
//                 // expect(res.body.numberOfUpdates).toBe(project.numberOfUpdates);
//             })
//             .end((err, res) => {
//                 if (err) {
//                     return done(err);
//                 }
//                 Project.find().then((projects) => {
//                     expect(projects.length).toBe(1);
//                     expect(categories[0].title).toBe(title);
//                     done();
//                 }).catch((e) => done(e));
//             });
//     });

    // it('shoud not create a new category with invalid body data', (done) => {
    //     request(app)
    //         .post('/api/categories')
    //         .send({})
    //         .expect(400)
    //         .end((err, res) => {
    //             if (err) {
    //                 return done(err);
    //             }
    //             Project.find().then((categories) => {
    //                 expect(categories.length).toBe(0);
    //                 done();
    //             });
    //         });
    // });
// });