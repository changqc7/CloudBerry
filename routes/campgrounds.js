var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

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
router.post("/campgrounds", middleware.isLogIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  console.log(process.env.GEOCODER_API_KEY);
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
        console.log(data);
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
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
router.put("/campgrounds/:id", middleware.checkCampOwnership, function(req, res){
  geocoder.geocode(req.body.campground.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
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