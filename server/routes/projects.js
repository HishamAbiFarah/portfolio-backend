const express = require('express');
const router = express.Router();
const { Project, validate } = require('../models/project');
const { Category } = require('../models/category');
const { authenticate } = require('../middleware/authenticate');

// Get Projects
router.get('/', async (req, res) => {
    // await Project
    //     .find({})
    //     .select('title tags numberOfUpdates category')
    //     .then((projects) => {
    //         res.send({ projects });
    //     }, (e) => {
    //         res.status(400).send(e);
    //     });
    const projects = await Project
        .find()
        .select('title tags numberOfUpdates category')

    const pageCount = Math.ceil(projects.length / 5);

    let page = parseInt(req.query.page);

    if (!page || page === 1) {
        page = 1
    } else {
        if (page <= pageCount) {
            page
        } else {
            return res.json({
                "status": 204,
                "message": "end of records reached",
                "projects": []
            });
        }
    }
    res.status(200).json({
        "message": "success",
        "status": 200,
        "totalRecords": projects.length,
        "page": page,
        "pageCount": pageCount,
        "projects": projects.slice(page * 5 - 5, page * 5)
    });
});

//todo implement saving arrays of tags
// Create new project
router.post('/', authenticate , async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(400).send('Invalid Category')

    let project = new Project({
        title: req.body.title,
        // tags: req.body.tags,
        tags: ['tag1' , 'tag2'],
        category: {
            _id: category._id,
            name: category.name
        }
    });

    project = await project.save();
    res.send(project);
});

// Update Project
router.put('/:id', authenticate , async (req, res) => {

    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(400).send('Invalid Category')

    const project = await Project.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        numberOfUpdates: req.body.numberOfUpdates,
        category: {
            _id: category._id,
            name: category.name
        }
    }, { new: true })

    if (!project) return res.status(404).send('The project with the given ID was not found.');

    res.send(project);
});

// Delete Project
router.delete('/:id', authenticate , async (req, res) => {

    const project = await Project.findByIdAndRemove(req.params.id)
    if (!project) return res.status(404).send('The project with the given ID was not found.');
    res.send(project);
});

// Get Project details by Id
router.get('/:id', async (req, res) => {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).send('The project with the given ID was not found.');
    res.send(project);
});

module.exports = router;