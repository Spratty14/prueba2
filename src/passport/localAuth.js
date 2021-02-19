const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

//settings
const User = require('../models/user')

//serialize
passport.serializeUser((user,done)=>{
    done(null,user.id);
})
passport.deserializeUser(async(id,done)=>{
    const user = await User.findById(id);
    done(null,user)
})

//register Authenticate
passport.use('local-register',new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password',
}, async(req,email,password,done)=>{
    const user = await User.findOne({email: email});
    console.log(user);
    if(user){
        return done(null,false,req.flash('registerErr','El correo electronico del usuario ya existe'));
    }
    //if(user.username){
    //    return done(null,false,req.flash('registerErr','El nombre de usuario ya está en uso'));
    //}
    if(!user){
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        console.log(newUser);
        await newUser.save();
        done(null,newUser);
    }
}))

//login Authenticate
passport.use('local-login',new LocalStrategy({
    passReqToCallback: true,
    passwordField: 'password',
    usernameField: 'email'
},async(req,email,password,done)=>{
    const user = await User.findOne({email: email})
    if(!user){
        return done(null,false,req.flash('loginErr','El usuario no existe'))
    }
    if(!user.comparePassword(password)){
        return done(null, false, req.flash('loginErr','La contraseña es incorrecta'))
    }
    return done(null,user)
}))