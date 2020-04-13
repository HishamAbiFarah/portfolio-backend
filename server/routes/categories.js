const express = require('express');
const router = express.Router();
const { Category, validate } = require('../models/category');
const { authenticate } = require('../middleware/authenticate');
// router.get('/', async (req, res) => {
//     const categories = await Category
//         .find()
//         .sort('name')
//         .select('name _id');
//     res.send(categories);
// });

// Get All Categories
router.get('/', async (req, res) => {
    await Category
        .find({})
        .select('name')
        .then((categories) => {
            res.send({ categories });
        }, (e) => {
            res.status(400).send(e);
        });
});

// Create new Category
router.post('/', authenticate, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    let category = new Category({
        name: req.body.name
    });

    category = await category.save();
    res.send(category);
});

// Update Category
// router.put('/:id', authenticate ,  async (req, res) => {
//     // const { error } = validate(req.body)
//     // if (error) return res.status(400).send(error.details[0].message);

//     // const category = await Category.findByIdAndUpdate(req.params.id, {
//     //     name: req.body.name
//     // }, { new: true })

//     // if (!category) return res.status(404).send('The category with the given ID was not found.');

//     // res.send(category);

//     res.send('test');
// });

router.put('/:id', authenticate , async (req, res) => {

    res.send('123');
    // const { error } = validate(req.body)
    // if (error) return res.status(400).send(error.details[0].message);

    // const skill = await Skill.findByIdAndUpdate(req.params.id, {
    //     name: req.body.name
    // }, { new: true })

    // if (!skill) return res.status(404).send('The skill with the given ID was not found.');

    // res.send(skill);
});

// Delete Category
router.delete('/:id', authenticate ,  async (req, res) => {

    const category = await Category.findByIdAndRemove(req.params.id)
    if (!category) return res.status(404).send('The category with the given ID was not found.');
    res.send(category);
});

// Get Category by ID
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).send('The category with the given ID was not found.');
    res.send(category);
});

module.exports = router;