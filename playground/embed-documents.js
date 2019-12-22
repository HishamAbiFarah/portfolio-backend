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

app.listen(port, () => {
    console.log(`Application Port: listening on port ${port}`);
});


const authorSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    bio: String,
    website: String
  });
  
  const Author = mongoose.model('Author', authorSchema);
  
  const Course = mongoose.model('Course', new mongoose.Schema({
    name: String,
    author:{
        type:authorSchema,
        required:true
    },
    authors:[authorSchema]
  }));
  
  async function createCourse(name, author , authors) {
    const course = new Course({
      name, 
      author,
      authors
    }); 
    
    const result = await course.save();
    console.log(result);
  }
  
  async function listCourses() { 
    const courses = await Course.find();
    console.log(courses);
  }

  // update author for a given course ID
  // Query First Approach
  async function updateAuthor(courseID){
      const course = await Course.findById(courseID);
      course.author.name = 'hisham abi farah';
      course.save();
  }

   // update author for a given course ID
  // Query First Approach
  async function updateAuthor2(courseID){
    const course = await Course.findById(courseID);
    course.author.name = 'hisham abi farah';
    course.save();
}

   // update author for a given course ID
   // Update First Approach
async function updateAuthor2(courseID) {
    const course = await Course.updateOne({ _id: courseID }, {
        $set: {
            'author.name': 'hisham af'
        }
    });
}
//remove author object from course
async function updateAuthor3(courseID) {
    const course = await Course.updateOne({ _id: courseID }, {
        $unset: {
            'author': ''
        }
    });
}
// createCourse('Node Course', new Author({ name: 'Hisham' }));
// updateAuthor('5df619dae476c42094e6dfa2');
// updateAuthor2('5df619dae476c42094e6dfa2');
// updateAuthor3('5df619dae476c42094e6dfa2');

// createCourse('New Node Js', new Author({ name: 'hisham' }),
//     [
//         new Author({ name: 'sub author 1' }),
//         new Author({ name: 'sub Author 2' })
//     ]
// );

// add new author to authors array in course 
async function addAuthor(courseId, author) {
    const course = await Course.findById(courseId);
    course.authors.push(author);
    course.save();
};

//remove an author by id 
async function removeAuthor(courseID, authorID){
    const course = await Course.findById(courseID);
    const author = course.authors.id(authorID);
    author.remove();
    course.save();
}

  // addAuthor('5df620f8a890b62984a1d48c', new Author({ name: 'new sub author' }));
  // removeAuthor('5df620f8a890b62984a1d48c', '5df6212076ab1e0b74435f44');


  //todo recheck how to print with populate
  async function listCourses(){
    //   const courses = await Course
    //   .find()
    //   .sort({name : 1});
    //   console.log(courses);
    
  };

  listCourses();
