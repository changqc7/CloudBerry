var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

//==================================
// COMMENTS
//====================================

router.get("/campgrounds/:id/comments/new" , middleware.isLogIn,  function(req, res) {
    Campground.findById(req.params.id , function(err , campground){
        if (err){
            console.log(err);
        }   else{
            res.render("comments/new.ejs" , {campground: campground});
        }
    });
});


router.post("/campgrounds/:id/comments" , middleware.isLogIn ,  function(req , res){
    //find campground
    Campground.findById(req.params.id , function(err , campground){
        if (err){
            console.log(err);
        }   else{
//            console.log(req.body.comment);
            Comment.create(req.body.comment , function(err , comment){
                if (err){
                    req.flash("error" , "Something go wrong");
                }   else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success" , "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//COMMENT EDIT
router.get("/campgrounds/:id/comments/:comment_id/edit" , middleware.checkCommentOwnership ,  function(req , res){
    Comment.findById(req.params.comment_id , function(err, comment) {
        if(err){
            res.redirect("back");
        }   else{
            res.render("comments/edit.ejs" , {campground_id: req.params.id , comment: comment});
        }
    });
});

//COMMENT UPDATE
router.put("/campgrounds/:id/comments/:comment_id" , middleware.checkCommentOwnership ,  function(req , res){
    Comment.findByIdAndUpdate(req.params.comment_id , req.body.comment , function(err , Updatecomment){
       if (err){
           res.redirect("back");
       }    else{
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//COMMENT DESTROY 
router.delete("/campgrounds/:id/comments/:comment_id" , middleware.checkCommentOwnership ,  function(req , res){
    Comment.findByIdAndRemove(req.params.comment_id , function(err){
        if (err){
            res.redirect("back");
        }   else{
            req.flash("success" , "Comment delete successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});





module.exports = router;