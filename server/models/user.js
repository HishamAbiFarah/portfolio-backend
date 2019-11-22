const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

//to add custom methods to user model we can't use : var User = mongoose.model('User', {})
// we have to create a mongoose schema for user model then implement all methods we want

var UserSchema = new mongoose.Schema({
    email: {
      type:String,
      required:true,
      minlength: 1,
      trim: true,
      unique:true, // unique for each user
      validate:{
        validator: (value) =>{
          return validator.isEmail(value);
        },
        message: '{value} is not a valid email'
      }
    },
    password:{
      type:String,
      required:true,
      minlength:6
    },
    tokens: [{
      access: {
        type:String,
        required:true
      },
      token:{
        type:String,
        required:true
      }
    }]
  }
);

// ^^ can be replaced with validator: validator.isEmail
// validator: (value) =>{
//   return validator.isEmail(value);
// },

//override jwt toJSON method
// after we return generateAuthToken for user  in post method all properties will be returned if we don't override it
//return only necessary values to user, not password, tokens,etc..

UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();  // toObject() : take mongoose variable user and convert to regular object where only properties available on document exist

  return _.pick(userObject, ['_id','email']);
};

//instance method (on document )
// no arrow function, regular function because arrow functions do not bind a this keyword
//we need 'this' for our method because it stores the individual document
UserSchema.methods.generateAuthToken = function (){
  var user = this; // we manipulate the user
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens.push({access,token});

  //save changes after we update user model with access and token
  return user.save().then(() =>{
    return token;
  });
};

UserSchema.methods.removeToken = function (token){
  var user = this;

  return user.update({
    $pull:{ //pull from tokens array , any object on the array that has a token property equal to token argument passed to removeToken()
      tokens :{
        token:token  // or tokens: {token}
      }
    }
  });
};

//Model method , access .statics(object turn into a model method)
// model methods are called with the model as the 'this' binding
UserSchema.statics.findByToken = function(token){
  var User = this; //upper case User, model is the this binding so set vars to uppercase, unlike instance methods which are called on the individual document so we use lowercase ,, var user = this
  var decoded; // stores the decoded jwt values, which are the return results from jwt.verify

  // we declare decoded as undefined
  // because jwt.verify() throws an error if secret doesn't the secret the token was created with or the token value was manipulated
  // we user try catch block
  try{
      decoded = jwt.verify(token, process.env.JWT_SECRET);

  }catch(e){
      // return a promise that will always reject
      return new Promise((resolve,reject) =>{
          reject(); //  this promise will be returned from findByToken() and inside server.js will get rejected and then() success case will never fire, the catch will
      });

      // or the upper code for return Promise() then rejetct() can be simplified
      //with return Promise.reject(); additionally I can send text inside reject so it will be caught by catch and placed in (e) I can use
  }

  //success
  // findOne will return a promise so we add return statement before it in order to add some chaining
  //chaining is so we can add a then() call onto findByToken() in sever.js
  return User.findOne({
    //query nested object properties
    '_id': decoded._id,
    'tokens.token' : token, // query nested properties, add '' for tokens.token or any other nested property, '_id' no need but just for consistency
    'tokens.access' : 'auth'
  });
};

//before we save passwords we have to hash them so we use MONGOOSE MIDDLEWARE
//pre middleware functions are executed one after another, when each middleware calls next. (taken from online docs , check)

UserSchema.pre('save' , function(next) {
  var user = this;

  //check if the password has been modified first so we can hash it
  if(user.isModified('password')){ //wrote password without '' , returned 400 err request with {} body, check debug this and others later
    bcrypt.genSalt(10 ,(err,salt)=>{
      bcrypt.hash(user.password,salt,(err,hash)=>{
        user.password = hash;
        next(); //have to be called or middleware will not complete
      });
    });
  }else{
    next();
  }
});

//model method

UserSchema.statics.findByCredentials = function (email,password){
  var User = this;
  // in sever.js we have a then() call and catch() call so we can use return keyword with return we are chaining a promise
  return User.findOne({email}).then((user) => { // sets {email} property to the email variable in function(email,password) call
    if(!user){
      return Promise.reject(); //triggers automatically the catch() case and we respond with error
    }
    //bcrypt.compare() and all bcrypt methods don't support promises, only callbacks, so we implement promises ourselves: we return a new promise
    return new Promise((resolve,reject)=>{
        bcrypt.compare(password,user.password, (err,res) => {
          if (res) {
            resolve(user);
          } else {
            reject();  //reject the promise
          }
      });
    });
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};
