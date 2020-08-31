const express = require('express');
const router = express.Router();
const { Project, validate } = require('../models/project');
const { Category } = require('../models/category');
const { authenticate } = require('../middleware/authenticate');

/**
 * @apiVersion 1.0.0
 * @api {get} api/projects List all projects
 * @apiGroup Projects
 * @apiParam {page} page number to get projects list 
 * @apiSuccess {String} message request success
 * @apiSuccess {Number} status request status code
 * @apiSuccess {Number} totalRecords request total number of records
 * @apiSuccess {Number} page request current page
 * @apiSuccess {Number} pageCount request number of pages
 * @apiSuccess {Object[]} projects list
 * @apiSuccess {String)} projects._id Project id
 * @apiSuccess {String} projects.title Project title
 * @apiSuccess {Number} projects.numberOfUpdates Project number of updates
 * @apiSuccess {Object[]} category list
 * @apiSuccess {String} category._id Category id
 * @apiSuccess {String} category.name Category name
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
    "message": "success",
    "status": 200,
    "totalRecords": 2,
    "page": 1,
    "pageCount": 1,
    "projects": [
        {
            "numberOfUpdates": 0,
            "_id": "5dff30794988e900c4ddec1f",
            "title": "Portfolio Backend in node.js",
            "category": {
                "_id": "5dff30304988e900c4ddec1c",
                "name": "backend web development"
            }
        },
        {
            "numberOfUpdates": 0,
            "_id": "5dff30b94988e900c4ddec22",
            "title": "Dinvo App",
            "category": {
                "_id": "5dff30414988e900c4ddec1e",
                "name": "frontend mobile development"
            }
        }
    ]
 *    }]
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */

router.get('/', async (req, res) => {
    const projects = await Project
        .find()
        .select('title numberOfUpdates category')

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


/**
 * @apiVersion 1.0.0
 * @api {post} /api/projects Create a new project
 * @apiGroup Projects
 * @apiParam {String} title Project title
 * @apiParamExample {json} Input
 *    {
*      	"title" : "test add",
	    "categoryId" : "5dff4b58925c0f1ce419f4cf"
 *    }
 * @apiSuccess {Object[]} projects list
 * @apiSuccess {String)} projects._id Project id
 * @apiSuccess {String} projects.title Project title
 * @apiSuccess {Number} projects.numberOfUpdates Project number of updates
 * @apiSuccess {Object[]} category list
 * @apiSuccess {String} category._id Category id
 * @apiSuccess {String} category.name Category name
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
        "numberOfUpdates": 0,
        "_id": "5f4d216c4843152c98398b77",
        "title": "test add",
        "category": {
            "_id": "5dff4b58925c0f1ce419f4cf",
            "name": "test category"
        }
 *    }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 500 Internal Server Error
 */
router.post('/', authenticate , async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(400).send('Invalid Category')

    let project = new Project({
        title: req.body.title,
        category: {
            _id: category._id,
            name: category.name
        }
    });

    project = await project.save();
    res.send(project);
});

/**
 * @apiVersion 1.0.0
 * @api {put} api/projects/:id Update a skill
 * @apiGroup Projects
 * @apiParam {id} id Project id
 * @apiParamExample {json} Input
 *    {
      	"title" : "edit project title,
	    "numberOfUpdates" : "1",
	    "categoryId" : "5dff4b58925c0f1ce419f4cf"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
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

/**
 * @apiVersion 1.0.0
 * @api {delete} /projects/:id Remove a project
 * @apiGroup Projects
 * @apiParam {id} id of project
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Delete error
 *    HTTP/1.1 403 Unauthorized
 * @apiErrorExample {json} Delete error
 *    HTTP/1.1 500 Internal Server Error
 */
router.delete('/:id', authenticate , async (req, res) => {

    const project = await Project.findByIdAndRemove(req.params.id)
    if (!project) return res.status(404).send('The project with the given ID was not found.');
    res.send(project);
});

/**
* @apiVersion 1.0.0
* @api {get} api/projects/:id Find a project
* @apiGroup Projects
* @apiParam {id} id Project Id
* @apiSuccess {String} id Project id
* @apiSuccess {String} name Project name
* @apiSuccess {Date} skills.date Creation Date of skill
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 OK
*    {
        "numberOfUpdates": 0,
        "_id": "5dff30794988e900c4ddec1f",
        "title": "Portfolio Backend in node.js",
        "category": {
            "_id": "5dff30304988e900c4ddec1c",
            "name": "backend web development"
    }
*    }
* @apiErrorExample {json} Project not found
*    HTTP/1.1 404 Not Found
* @apiErrorExample {json} Find error
*    HTTP/1.1 500 Internal Server Error
*/
router.get('/:id', async (req, res) => {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).send('The project with the given ID was not found.');
    res.send(project);
});

module.exports = router;