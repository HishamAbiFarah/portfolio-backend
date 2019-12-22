require('./../server/config/config');
require('./../server/db/mongoose');

const express = require('express');
const mongoose = require('mongoose');

const config = require('config');

const app = express();
const port = process.env.PORT || 3001;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Author = mongoose.model('Author', new mongoose.Schema({
    name: String,
    bio: String,
    website: String
  }));


const Course = mongoose.model('Course', new mongoose.Schema({
    name: String,
    // reference author
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author' // name of target collection
    }
}));


  async function createAuthor(name, bio, website) { 
    const author = new Author({
      name, 
      bio, 
      website 
    });
  
    const result = await author.save();
    console.log(result);
  }
  
  async function createCourse(name, author) {
    const course = new Course({
      name, 
      author
    }); 
    
    const result = await course.save();
    console.log(result);
  }
  
  async function listCourses() { 
    const courses = await Course
      .find()
      // select _id ,name from course and select author //  will print only _id of author if without populate
      .select('name author') 
     // .populate('author') // will populate all author properties
      .populate('author' ,'name website -_id') // will populate only name and website of author
      // we can populate other documents : categories, tags , comments etc..
    console.log(courses);
  }
  
   // createAuthor('hisham', 'My bio', 'My Website');
  // createCourse('JS Course', '5df60c95d0418b0948af08af');
 listCourses();


app.listen(port, () => {
    console.log(`Application Port: listening on port ${port}`);
});