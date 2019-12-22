const express = require('express');
const router = express.Router();
const { Skill, validate } = require('../models/skill');


router.get('/', async (req, res) => {
    const skills = await Skill
        .find()
        .sort({ name: 1 })
        .select({ name: 1 })
        .limit(10)
    res.status(200).send(skills);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    let skill = new Skill({
        name: req.body.name
    });

    skill = await skill.save();
    res.send(skill);
    // const skill = new Skill({
    //     name: req.body.name
    // });

    // try {
    //      skill = await skill.save(); 
    //     res.status(200).send(skill);
    // } catch (err) {
    //     // for(field in err.errors){
    //       // console.log(err.errors[field].message);
    //         res.status(404).send('error');
    //     // }
    // }
});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

router.get('/:id', (req, res) => {

});


module.exports = router;