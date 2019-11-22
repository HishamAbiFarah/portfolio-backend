var mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
  _creator:{
    type:mongoose.Schema.Types.ObjectId,
    required: true
  },
  text: {
    type:String,
    required:true,
    minlength: 1,
    trim: true
  },
  completed:{
    type:Boolean,
    default:false
  },
  completedAt:{
    type: Number,
    default:null
  },
  image:{
    type:String,
    default:null
  },
  thumbnail:{
    type:String,
    default:null
  }
});

var Todo = mongoose.model('Todo', todoSchema);

module.exports = {Todo};
