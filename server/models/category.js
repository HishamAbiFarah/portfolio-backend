const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
});

const Category = new mongoose.model('Category', categorySchema);

validateCategory = (category) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(category);
}

exports.categorySchema = categorySchema;
exports.Category = Category; 
exports.validate = validateCategory;