const express = require('express');
const router = express.Router();
const { Category, validate } = require('../models/category');
const { authenticate } = require('../middleware/authenticate');

/**
 * @apiVersion 1.0.0
 * @api {get} api/categories List all categories
 * @apiGroup Categories
 * @apiSuccess {Object[]} categories list
 * @apiSuccess {String)} categories.id Category id
 * @apiSuccess {String} categories.name Category name
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
        "_id": "5dff620e7b97a5264ccf5803",
        "name": "test category",
 *    }]
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */
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

/**
 * @apiVersion 1.0.0
 * @api {post} /api/categories Create a new category
 * @apiGroup Categories
 * @apiParam {String} name Category name
 * @apiParamExample {json} Input
 *    {
 *      "name" : "test category"
 *    }
 * @apiSuccess {String} _id Category id
 * @apiSuccess {String} name Category name
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
        "_id": "5f4ced2cf8b0640d243ba3ca",
        "name": "test post",
        "__v": 0
 *    }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 500 Internal Server Error
 */
router.post('/', authenticate, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    let category = new Category({
        name: req.body.name
    });

    category = await category.save();
    res.send(category);
});

/**
 * @apiVersion 1.0.0
 * @api {put} api/categories/:id Update a category
 * @apiGroup Categories
 * @apiParam {id} id Category id
 * @apiParam {String} name Category name
 * @apiParamExample {json} Input
 *    {
 *      "name": "Category name"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
router.put('/:id', authenticate , async (req, res) => {

    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, { new: true })

    if (!category) return res.status(404).send('The category with the given ID was not found.');

    res.send(category);
});

/**
 * @apiVersion 1.0.0
 * @api {delete} /categories/:id Remove a category
 * @apiGroup Categories
 * @apiParam {id} id of category
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Delete error
 *    HTTP/1.1 403 Unauthorized
 * @apiErrorExample {json} Delete error
 *    HTTP/1.1 500 Internal Server Error
 */
router.delete('/:id', authenticate ,  async (req, res) => {

    const category = await Category.findByIdAndRemove(req.params.id)
    if (!category) return res.status(404).send('The category with the given ID was not found.');
    res.send(category);
});

/**
* @apiVersion 1.0.0
* @api {get} api/categories/:id Find a Category
* @apiGroup Categories
* @apiParam {id} id Category Id
* @apiSuccess {String} _id Category id
* @apiSuccess {String} name Category name
* @apiSuccessExample {json} Success
*    HTTP/1.1 200 OK
*    {
       "_id": "5dff620e7b97a5264ccf5803",
       "name": "test category",
*    }
* @apiErrorExample {json} Category not found
*    HTTP/1.1 404 Not Found
* @apiErrorExample {json} Find error
*    HTTP/1.1 500 Internal Server Error
*/
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).send('The category with the given ID was not found.');
    res.send(category);
});

module.exports = router;