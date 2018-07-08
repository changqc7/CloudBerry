var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

router.get("/", function(req, res){
    res.render("landing.ejs");
});

// INDEX show all campgrounds
router.get("/campgrounds" , function(req , res){

    Campground.find({} , function(err , allcampgrounds){
        if (err){
            console.log(err);}
        else{
           res.render("campgrounds/index.ejs" , {campgrounds : allcampgrounds}); 
        }
    });
});


// CREATE add new to the database
router.post("/campgrounds" ,middleware.isLogIn ,  function(req , res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, price: price ,  description: desc, author: author};
    Campground.create(newCampground , function(err , newlycampground){
        if (err){
            console.log(err);}
        else{
            res.redirect("/campgrounds");
        }
    })
    ;
});

// NEW show form to create new campground
router.get("/campgrounds/new" ,middleware.isLogIn ,  function(req , res){
    res.render("campgrounds/new.ejs");
});

// SHOW show more info
router.get("/campgrounds/:id" , function(req , res){
    Campground.findById(req.params.id).populate("comments").exec(function(err , foundid){
        if (err){
            console.log(err);
        }
        else{
            res.render("campgrounds/show.ejs" , {campground: foundid});
        }
    });
});


// EDIT ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        
        res.render("campgrounds/edit.ejs", {campground: foundCampground});
    });
});


//UPDATE ROUTE

router.put("/campgrounds/:id" , middleware.checkCampOwnership, function(req , res){
    Campground.findByIdAndUpdate(req.params.id , req.body.campground , function(err , update){
        if (err){
            res.redirect("/campgrounds");
        }   else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY ROUTE

router.delete("/campgrounds/:id" , middleware.checkCampOwnership, function(req , res){
    Campground.findByIdAndRemove(req.params.id , function(err){
        if (err){
            res.redirect("/campgrounds");
        }   else{
            res.redirect("/campgrounds");
        }
    });
});




module.exports = router;