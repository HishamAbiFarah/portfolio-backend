const express = require('express');
const router = express.Router();
const _ = require('lodash');

var { User } = require('./../models/user');
var { authenticate } = require('./../middleware/authenticate');

// new user route
// localhost:3001/api/users
/**
 * @apiVersion 1.0.0
 * @api {post} /api/users Create a new user
 * @apiGroup Users
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 * @apiParamExample {json} Input
 *    {
*     "email" : "email@email.com",
	    "password" : "5dff4b5"
 *    }
 * @apiSuccess {String)} users._id User id
 * @apiSuccess {String)} users.email User email
 * @apiSuccess {String)} users.phone User phone
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
        "_id": "5f4d24c9c101812450449ef3",
        "email": "email@email.com",
        "phone": "70992123"
 *    }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 500 Internal Server Error
 */
router.post('/', (req, res) => {
  var body = _.pick(req.body, ['email', 'password', 'phone']);
  var user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

//get user route -- login
router.get('/', authenticate, (req, res) => {
  res.send(req.user);
});

//user login route
/**
 * @apiVersion 1.0.0
 * @api {post} /api/users Login a user
 * @apiGroup Users
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 * @apiParamExample {json} Input
 *    {
*     "email" : "email@email.com",
	    "password" : "5dff4b5"
 *    }
 * @apiSuccess {String)} users.x-auth User token
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
        "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGI1YWViNjEzYzMzMzBmZmNhODM4NDYiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTcyMTg3ODMwfQ.iR_WhrKIeLd5fReqFVhlGe1ssqUQ97tLVbqyArDO5Kc"
 *    }
 * @apiErrorExample {json} Login error
 *    HTTP/1.1 500 Internal Server Error
 */
router.post('/', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

//logout route
router.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

module.exports = router;