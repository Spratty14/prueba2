const express = require('express')
const {Schema,model} = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    loginAt: {type: Date, default: Date.now()},
    profileImg: {type: String, default: 'https://res.cloudinary.com/hihn4nkd3/image/upload/v1609174546/profile_ckszfr.png'},
    banner: {type: String,default:'https://res.cloudinary.com/hihn4nkd3/image/upload/v1609174458/download_ftwpu5.jpg'},
    description: String,
    state: String,
    uploads: Number,
    visitors: Number,
    likes: Number
})

userSchema.methods.encryptPassword = (password)=>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
}
userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

module.exports = model('userSchema',userSchema)