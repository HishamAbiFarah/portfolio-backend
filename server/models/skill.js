const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const skillSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        min:5,
        max:255,
        trim:true
    },
    date: { 
        type: Date, default: Date.now 
    },
    icon:{
        type:String,
        min:5,
        max:255,
        trim:true
    }
});


const Skill = mongoose.model('Skill',skillSchema);

validateSkill = (skill) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required()
    });

    return schema.validate(skill);
}

exports.categorySchema = skillSchema;
exports.Skill = Skill; 
exports.validate = validateSkill;