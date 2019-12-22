require('./../server/config/config');
require('./../server/db/mongoose');

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet')
const morgan = require('morgan');

const config = require('config');

const courses = require('./../server/routes/courses');
const skills = require('./../server/routes/skills');

const logger = require('./../server/middleware/logger');

const app = express();
const port = process.env.PORT || 3001;

//configuration
//console.log(`Application Name: ${config.get('name')}`);
// console.log(`Application Mail Server: ${config.get('mail.host')}`);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(logger);

app.use('/api/courses', courses); // for all endpoints related to api/courses , use the courses router
app.use('/api/skills' , skills);

//third party middlewares
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Application morgan: enabled...');
}
app.use(helmet());


// validations
/**
 * use mongoose validation AND Joi validation: 
 * Joi handles user input (first attack, make sure data from client is valid) 
 * mongoose validation we make sure data we save in db is in right shape or any other operation
 * maybe we forget a property that should be required, so we enforce validation & make sure invalid docs or operations are valid 
 * 
 * built-in validators : required, minLength,maxLength,match for strings, min and max for numbers and dates, enum, etc..
 * custom validators: for example if we want to have at least one tag required we write a validator function for it.
 * async validators: validation logic reading data from db or remote server so we use async validators (tags2)
 * 
 * SchemaType options: for String (lowercase,uppercase,trim) , for numbers (get,set)
 */
// create schema
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim:true,
        lowercase:true
        // match: /patern/ // for regex
    },
    category: {
        type: String,
        enum: ['web', 'mobile ', 'network'], // category has to be one of these enum values only
        required: true
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            validator: function (v) {
                return v && v.length > 0; // ensures an array exists (no nul values) && has at least one value
            },
            message: "A course should have at least one tag"
        }
    },
    tags2: {
        type: Array,
        validate: {
            isAsync: true, // deprecated https://mongoosejs.com/docs/validation.html#async-custom-validators
            validator: function (v, callback) {
                setTimeout(() => {
                    // do async work
                    const result = v && v.length > 0;
                    callback(result);//when result is ready call callback with the result 
                }, 1000);
            },
            message: "A course should have at least one tag"
        }
    },
    price: {
        type: Number,
        get: v => Math.round(v), // called when we read value of property (if price is 15.8 it's read as 16)
        set: v => Math.round(v), // called when we set value of property
        // price is required only if course is published
        // 'this' is value of the enclosing execution context not the model
        // means a function in mongoose will call this function , 'this' will reference that calling function not the course
        required: function () { return this.isPublished; }
    },
    date: {
        type: Date,
        default: Date.now
    },
    isPublished: Boolean
});

// create class from schema
const Course = mongoose.model('Course', courseSchema);

// new course
async function createCourse() {
    const course = new Course({
        name: "Course",
        author: "hisham",
        category: 'web',
        tags2: ['react'],
        tags: ['Angular'], // array of strings
        isPublished: false
    });

    try {
        const result = await course.save(); // async call, returns promise
        console.log(result);
    } catch (err) {
        for(field in err.errors){
            console.log(err.errors[field].message);
        }
    }
}

// list courses
async function getCourses() {

    //comparison operators:
    // eq (equal)
    // neq (not equal)
    // gt (greater than)
    // gte (greater than or equal to)
    // lt (less than)
    // lte (less than or equal to)
    // in (in)
    // nin (not in) 

    // logical operators
    //and
    // or

    const courses = await Course
        // .find({ author: "hisham", isPublished: true })
        // .find({ author: "hisham"}) 
        // .find({price : 10}) // course with price 10
        // .find ({price : {$gte:10 , $lte:20}}) // course price between 10 and 20
        //.find({ price: { $in: [10, 15, 20] } }) // course price 10 15 or 20

        //reg ex starts with hish and by default is case sensitive
        //.find({author: /^hish/}) 

        //regex ends with asd and is case insensitive
        //.find({author: /asd$/i}) 

        //regex contains abc and is case insensitive
        //.find({ author: /.*abc.*/i })

        // find all authors named hisham OR isPublished is true AND price = 10
        .find({ isPublished: true })
        .or([{ tags: 'frontend' }, { tags: 'backend' }])
        .and({ price: 10 })
        .limit(10)
        .sort({ name: 1 }) // sort by name , 1 ascending, -1 descending
        .select({ name: 1, tags: 1 })
    // .count() // returns count of documents filtered
    console.log(courses);
}

//list courses paginate
async function getCoursesPaginate() {
    //pagination, values won't be harcoded in real world app
    const pageNumber = 1;
    const pageSize = 10;

    // /api/courses?pageNumber=2&pageSize = 10 

    const courses = await Course
        .find({ author: 'hisham' })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ price: -1 }) // sort by price , 1 ascending, -1 descending
        .select({ name: 1, tags: 1, price: 1 })
    console.log(courses);
}

// update course
updateCourse1 = async (id) => {
    // 1st approach to update document : Query First Approach
    //useful if we receive an input from the client and we need to have conditions on this course
    // findById()
    //modify its properties
    //save

    const course = await Course.findById(id);
    if (!course) return;

    // individually update document properties
    // or set with object of key/value pairs for properties

    // individually
    // course.isPublished = true;
    // course.author = 'Another Author';

    // object of key/value
    course.set({
        isPublished: false,
        author: 'Another Author2'
    });

    const result = await course.save();
    console.log(`update result ${result}`);
}

updateCourse2 = async (id) => {
    //2nd approach : Update First Approach
    // no input from client , update one or many docs directly in db
    //$set : mongodb operator, $inc, $min, $max, $currentDate etc..

    // updates document and returns result not document 
    // result : { n: 1, nModified: 1, ok: 1 }
    const result = await Course.updateOne({ _id: id }, {
        $set: {
            author: 'hish',
            isPublished: false
        }
    });

    // updates document and returns original document  have to specify 
    //new  parameter to true to return new document
    const result2 = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'hisham2',
            isPublished: false
        }
    }, { new: true });

    console.log(result2);
}

// delete course
deleteCourse = async (id) => {
    //  const result = await Course.deleteOne({_id: id}); 
    // console.log(result) // result : { n: 1, nModified: 1, ok: 1 }

    const course = await Course.findByIdAndDelete(id);
    console.log(course); // null
}

// createCourse();
// getCourses();
// getCoursesPaginate();
//deleteCourse('5ded20657289251978288ba2');
//updateCourse2('5ded2090f6d88829b8983923');

//multiple params
app.get('/api/posts/:year/:month', (req, res) => {
    //http://localhost:3000/api/posts/2012/2 >> 
    //request param object: req.params : { year: "2012", month:"2"}
    // route params: required values : year and month
    // res.send(req.params); 

    //query string parameters : optional values (use to provide additional data to our backend services)
    // http://localhost:3000/api/posts/2012/2?sortBy=name

    res.send(req.query); // result : { sortBy: "name"}

    // can't send both req.params and req.query 
})

app.listen(port, () => {
    console.log(`Application Port: listening on port ${port}`);
});