const express = require('express');
const router = express.Router();
const _ = require('lodash');

var { User } = require('./../models/user');
var { authenticate } = require('./../middleware/authenticate');

// new user route
router.post('/users', (req, res) => {
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
router.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

//user login route
router.post('/users/login', (req, res) => {
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