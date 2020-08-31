const express = require('express');
const router = express.Router();
const { Skill, validate } = require('../models/skill');
const { authenticate } = require('../middleware/authenticate');

/**
 * @apiVersion 1.0.0
 * @api {get} api/skills List all skills
 * @apiGroup Skills
 * @apiParam {page} page number to get skills list
 * @apiSuccess {Object[]} skills list
 * @apiSuccess {String)} skills.id Skill id
 * @apiSuccess {String} skills.name Skill name
 * @apiSuccess {Date} skills.date Creation Date of skill
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
        "_id": "5dff620e7b97a5264ccf5803",
        "name": "test skill",
        "date": "2019-12-22T12:31:10.647Z"
 *    }]
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */

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


/**
 * @apiVersion 1.0.0
 * @api {post} /api/skills Create a new skill
 * @apiGroup Skills
 * @apiParam {String} name Skill name
 * @apiParamExample {json} Input
 *    {
 *      "name" : "test skill"
 *    }
 * @apiSuccess {String} id Skill id
 * @apiSuccess {String} name Skill name
* @apiSuccess {Date} skills.date Creation Date of skill
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
        "_id": "5f4ced2cf8b0640d243ba3ca",
        "name": "test post",
        "date": "2020-08-31T12:29:32.671Z",
        "__v": 0
 *    }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 500 Internal Server Error
 */
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


/**
 * @apiVersion 1.0.0
 * @api {delete} /skills/:id Remove a skill
 * @apiGroup Skills
 * @apiParam {id} id of skill
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Delete error
 *    HTTP/1.1 403 Unauthorized
 * @apiErrorExample {json} Delete error
 *    HTTP/1.1 500 Internal Server Error
 */
router.delete('/:id', authenticate, async (req, res) => {

    const skill = await Skill.findByIdAndRemove(req.params.id)
    if (!skill) return res.status(404).send('The skill with the given ID was not found.');
    res.send(skill);

});

/**
 * @apiVersion 1.0.0
 * @api {put} api/skills/:id Update a skill
 * @apiGroup Skills
 * @apiParam {id} id Skill id
 * @apiParam {String} name Skill name
 * @apiParamExample {json} Input
 *    {
 *      "name": "skill name"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
router.put('/:id', authenticate, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const skill = await Skill.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, { new: true })

    if (!skill) return res.status(404).send('The skill with the given ID was not found.');

    res.send(skill);
});

/**
* @apiVersion 1.0.0
* @api {get} api/skills/:id Find a skill
* @apiGroup Skills
* @apiParam {id} id Skill Id
* @apiSuccess {String} id Skill id
* @apiSuccess {String} name Skill name
* @apiSuccess {Date} skills.date Creation Date of skill
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 OK
*    {
       "_id": "5dff620e7b97a5264ccf5803",
       "name": "test skill",
       "date": "2019-12-22T12:31:10.647Z"
*    }
* @apiErrorExample {json} Skill not found
*    HTTP/1.1 404 Not Found
* @apiErrorExample {json} Find error
*    HTTP/1.1 500 Internal Server Error
*/
router.get('/:id', async (req, res) => {
    const skill = await Skill.findById(req.params.id)
    if (!skill) return res.status(404).send('The skill with the given ID was not found.');
    res.send(skill);
});

module.exports = router;