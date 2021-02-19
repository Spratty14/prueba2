const express = require('express')
const cloudinary = require('cloudinary')

//settings
const router = express.Router()
const Image = require('../models/cards')
const User = require('../models/user')
const { unlink } = require('fs-extra')
const passport = require('passport')
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,//'hihn4nkd3'
    api_key: process.env.CLOUDINARY_UR, //226848297916893,
    api_secret: process.env.CLOUDINARY_API_SECRET//'s6QFVdKqlSzrYP0CJqjrXHPf7kM'
})

//functions
function authCheker(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect('/login')
    }
};

//index
router.get('/',async(req,res,next)=>{
    const images = await Image.find();
    res.render('index',{
        images
    });
})

//profile
router.get('/profile',authCheker, async(req,res)=>{
    const images = await Image.find({owner: req.user.username});
    res.render('profile',{
        images
    })
})

//image view
router.get('/imgView/:id',async(req,res)=>{
    const {id} = req.params;
    const image = await Image.findById(id);
    res.render('imgView',{
        image
    })
})

//Image upload GET
router.get('/upload',(req,res)=>{
    res.render('upload')
})


//Image upload POST
router.post('/upload',async(req,res)=>{
    const {title,description,examples,owner} = req.body;
    const result = await cloudinary.v2.uploader.upload(req.file.path)//find image path to be uploaded to mongoose
    console.log(result);
    const newImage = new Image({ //options save in the data base
        title,
        description,
        examples,
        owner: req.user.username,
        ownerImg: req.user.profileImg,
        imageURL: result.url, //image cloudinary url
        public_id: result.public_id //image unic id given
    });
    await newImage.save()//mongoose
    await unlink(req.file.path)//fs-extra(remove the image in his path in the server project)
    res.redirect('/')
})

//Image settings
router.get('/edit/:id',async (req,res)=>{
    const {id} = req.params;
    const image = await Image.findById(id);
    res.render('imgUpdate',{
        image
    })
})
router.post('/edit/:id',async (req,res)=>{
    //variables
    const {id} = req.params;
    const image = await Image.findById(id)
    const {title,description,examples} = req.body;
    
    //delete previus image
    await cloudinary.v2.uploader.destroy(image.public_id);
    await Image.findByIdAndDelete(id);

    //upload new image
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const newImage = new Image({
        title,
        description,
        examples,
        owner: req.user.username,
        ownerImg: req.user.profileImg,
        imageURL: result.url,
        public_id: result.public_id,
    })
    await newImage.save()
    await unlink(req.file.path)

    res.redirect('/');
})
router.get('/delete/:id',async(req,res)=>{
    const {id} = req.params;
    const image = await Image.findById(id);
    await cloudinary.v2.uploader.destroy(image.public_id);
    await Image.findByIdAndDelete(id);
    res.redirect('/')
})

//Register
router.get('/register',(req,res,next)=>{
    res.render('register')
})
router.post('/register',passport.authenticate('local-register',{
    failureFlash: true,
    failureRedirect: '/register',
    successRedirect: '/login',
}))

//Login
router.get('/login', (req, res,next) => {
    res.render('login')
})
router.post('/login', passport.authenticate('local-login',{
    failureFlash: true,
    failureRedirect: '/login',
    successRedirect: '/'
}))
//Logout
router.get('/logout',(req,res,next)=>{
    req.logOut()
    res.redirect('/')
})

//User settings
router.get('/deleteAccount',authCheker,async(req,res)=>{
    res.render('account/deleteAccount')
})
router.get('/deleteAccount/confirm',authCheker,async(req,res)=>{
    let imagenes = await Image.find({owner: req.user.username});//takes the images that belongs the user
    imagenes.forEach(async(imagen)=>{//use the "imagenes" var to delete the images in clodnary one by one
        await cloudinary.v2.uploader.destroy(imagen.public_id);
    })
    await User.deleteOne({_id:req.user._id});//delete user in mongoose
    await Image.deleteMany({owner: req.user.username});//delete all the images of the user in mongoose
    res.redirect('/');
})
router.post('/banner/:id',authCheker,async (req,res,next)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    if(user.banner){
        
    }
    const userSettings = 
    res.redirect('/profile')
})


module.exports = router;