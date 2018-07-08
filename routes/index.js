var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");


//==========================
// AUTH ROUTES
//===========================

//show register form
router.get("/register" , function(req, res) {
    res.render("register.ejs");
});

//handle sign up logic
router.post("/register" , function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser , req.body.password , function(err , user){
        if (err){
            req.flash("error" , err.message);
            return res.render("register.ejs");
        }  
        passport.authenticate("local")(req , res , function(){
            req.flash("success" , "Welcome to the YelpCamp" + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login" , function(req, res) {
    res.render("login.ejs");
});
//handle login logic
router.post("/login" , passport.authenticate("local" , 
    {
        successRedirect: "/campgrounds" , 
        failureRedirect: "/login"
    }) , function(req, res){});

//logout

router.get("/logout" , function(req, res) {
    req.logout();
    req.flash("success" , "Logged You Out");
    res.redirect("/campgrounds");
});


module.exports = router;