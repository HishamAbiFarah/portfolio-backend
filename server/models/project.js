const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { categorySchema } = require('./../models/category');

//todo implement images array for main image, thumbnail
const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 255
    },
    category: {
        type: categorySchema,
        required: true
    },
    tags: {
        type: Array,
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: "A project should have at least one tag"
        }
    },
    numberOfUpdates: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
        default: 0
    }
});

const Project = mongoose.model('Project', projectSchema);

validateProject = (project) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(255).required(),
        numberOfUpdates: Joi.number().min(0).max(255).required(),
        categoryId: Joi.string().required()
        // tags:Joi.string().required()
    })

    return schema.validate(project);
}

exports.projectSchema = projectSchema;
exports.Project = Project;
exports.validate = validateProject;