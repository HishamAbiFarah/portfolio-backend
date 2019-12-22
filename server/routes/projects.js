const express = require('express');
const router = express.Router();
const { Project, validate } = require('../models/project');
const { Category } = require('../models/category');

// router.get('/', async (req, res) => {
//     const categories = await Category
//         .find()
//         .sort('name')
//         .select('name _id');
//     res.send(categories);
// });

router.get('/', async (req, res) => {
    await Project
        .find({})
        .select('title tags numberOfUpdates category')
        .then((projects) => {
            res.send({ projects });
        }, (e) => {
            res.status(400).send(e);
        });
});

//todo implement saving arrays of tags
router.post('/', async (req, res) => {
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

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(400).send('Invalid Category')

    const project = await Project.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        category: {
            _id: category._id,
            name: category.name
        }
    }, { new: true })

    if (!project) return res.status(404).send('The project with the given ID was not found.');

    res.send(project);
});

router.delete('/:id', async (req, res) => {

    const project = await Project.findByIdAndRemove(req.params.id)
    if (!project) return res.status(404).send('The project with the given ID was not found.');
    res.send(project);
});

router.get('/:id', async (req, res) => {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).send('The project with the given ID was not found.');
    res.send(project);
});

module.exports = router;