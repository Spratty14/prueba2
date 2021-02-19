const express = require('express')
const {Schema,model} = require('mongoose')

const cardSchema = new Schema({
    title: {type: String, required: true},
    owner: {type: String, required: true},
    ownerImg: {type: String, required: true},
    createdAt: {type: Date, default: Date.now()},
    description: String,
    examples: String,
    level: String,
    imageURL: String,//image cloudinary url
    public_id: String,//image unique id
})

module.exports = model('cardSchema', cardSchema)