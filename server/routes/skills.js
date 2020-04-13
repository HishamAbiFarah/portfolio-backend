const express = require('express');
const router = express.Router();
const { Skill, validate } = require('../models/skill');
const { authenticate } =  require('../middleware/authenticate');

//todo handle res.json if skills is empty

router.get('/', async (req, res) => {
    const skills = await Skill
        .find()
        .select({ name: 1, date: 1 })

    const pageCount = Math.ceil(skills.length / 5);

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
                "skills": []
            });
        }
    }
    res.status(200).json({
        "message": "success",
        "status": 200,
        "totalRecords": skills.length,
        "page": page,
        "pageCount": pageCount,
        "skills": skills.slice(page * 5 - 5, page * 5)
    });
});

// router.get('/', async (req, res) => {
//     const skills = await Skill
//         .find()
//         .sort({ name: 1 })
//         .select({ name: 1 })
//         .limit(3)
//     res.status(200).send(skills);
// });

router.post('/', authenticate, async (req, res) => {
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


// recheck
router.delete('/:id', authenticate , async (req, res) => {

    const skill = await Skill.findByIdAndRemove(req.params.id)
    if (!skill) return res.status(404).send('The skill with the given ID was not found.');
    res.send(skill);

});

router.put('/:id', authenticate , async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const skill = await Skill.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, { new: true })

    if (!skill) return res.status(404).send('The skill with the given ID was not found.');

    res.send(skill);
});

router.get('/:id', async (req, res) => {
    const skill = await Skill.findById(req.params.id)
    if (!skill) return res.status(404).send('The skill with the given ID was not found.');
    res.send(skill);
});

module.exports = router;