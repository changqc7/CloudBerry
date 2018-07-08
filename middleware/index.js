var Campground = require("../models/campground");
var Comment = require("../models/comment");

// ALL MIDDLEWARE

var Middleware = {};

Middleware.checkCampOwnership = function(req , res , next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id , function(err , foundCamp){
            if (err){
                req.flash("error" , "Campground not found");
                res.redirect("back");
            }   else{
                //Does uesr own the campground?
                if (foundCamp.author.id.equals(req.user._id)){
                    next();
                }   else{
                    req.flash("You don't have the premission");
                    res.redirect("back");
                }
            }
        });
    }   else{
        req.flash("error" , "You need logged in first");
        res.redirect("back");
    }
};


Middleware.isLogIn = function(req , res ,next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error" , "Please Login First");
    res.redirect("/login");
};

Middleware.checkCommentOwnership = function(req , res , next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id , function(err , foundComment){
            if (err){
                req.flash("error" , "Campground not found");
                res.redirect("back");
            }   else{
                //Does uesr own the comment?
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                }   else{
                    req.flash("You don't have the premission");
                    res.redirect("back");
                }
            }
        });
    }   else{
        req.flash("error" , "You need logged in first");
        res.redirect("back");
    }
};


module.exports = Middleware;