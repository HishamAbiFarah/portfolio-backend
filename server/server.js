require('./config/config');
require('./db/mongoose');

// const config = require('config');
const express = require('express');

const courses = require('./routes/courses');
const categories = require('./routes/categories');
const users = require('./routes/users');
const projects = require('./routes/projects');
const skills = require('./routes/skills');
const images = require('./routes/images');

const helmet = require('helmet')
const morgan = require('morgan');
const cors = require('./middleware/cors');

const app = express();

//prevent CORS errors
app.use(cors);

const port = process.env.PORT;

//configuration
// console.log(`Application Name: ${config.get('name')}`);
// console.log(`Application Mail Server: ${config.get('mail.host')}`);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.set('view engine', 'ejs');

//routes
app.use('/api/courses', courses); // all endpoints related to api/courses , use the courses router
app.use('/api/categories', categories);
app.use('/api/projects', projects);
app.use('/api/skills', skills);
app.use('/users', users);
app.use('/api/images' , images);
app.use('/' , images);

// app.use(logger);

// app.set('DEBUG','app:startup');
// app.set('env','development');

// recheck how to use debug module , ie startuDebugger here
// check vid templating engine

//third party middlewares
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Application morgan: enabled...');
}
app.use(helmet());

app.listen(port, () => {
    console.log(`Application Port: listening on port ${port}`);
});

module.exports = { app };