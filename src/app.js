const express = require('express')
const ejs = require('ejs')
const morgan = require('morgan')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const {format} = require('timeago.js')
const {unlink} = require('fs-extra')
const {v4: uuid} = require('uuid')
const { diskStorage } = require('multer')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const dotenv = require('dotenv').config()

const user = require('./models/user')


//initialize
const app = express()
require('./database')
require('./passport/localAuth')

//settings
app.set('port', process.env.PORT || 3000)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
const storage = multer.diskStorage({
    destination: path.join(__dirname,'public/img/uploads'),
    filename: function(req,file,cb){
        cb(null,uuid()+path.extname(file.originalname))
    }
})
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

//middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(multer({storage}).single('image'))
app.use((req,res,next)=>{
    app.locals.registerErr = req.flash('registerErr')
    app.locals.loginErr = req.flash('loginErr')
    app.locals.user = req.user;
    app.locals.format = format;
    next();
})

//public
app.use(express.static(path.join(__dirname,'public')))

//routes
app.use('/',require('./routes/routes'))

//listen
app.listen(app.get('port'),()=>{
    console.log(`Listen on ${app.get('port')}`)
})