var express = require("express"),
    router =express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    User = require("../models/user");
    
var middleware = require("../middleware");  /* express automatically requires 'index.js' files by default */




router.get("/new", middleware.isLoggedIn ,  function(req, res) {
   
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});     
        }
        
   })
   
});

router.post("/", middleware.isLoggedIn,  function(req, res){
    
    Comment.create(req.body.comment, function(err , addedComment){
        if(err){
            console.log(err);
        }else{
            Campground.findById(req.params.id, function(err, campground) {
               if(err) {
                   console.log(err);
               }else{
                   
                   addedComment.author.id = req.user._id;
                   addedComment.author.username  = req.user.username;
                   addedComment.save();
                   campground.comments.push(addedComment);
                   campground.save();
                   req.flash("success","Successfully added comment!");
                   res.redirect("/campgrounds/" + campground._id);
               }
            });
        }
    })
});


//Edit comment

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    
        Comment.findById(req.params.comment_id, function(err, comment) {
            if(err){
                res.redirect("back");
            }else{
                 res.render("comments/edit",{campground_id: req.params.id, comment: comment});
            }
        }); 
    
});

router.put("/:comment_id", middleware.checkCommentOwnership ,function(req, res){
   
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","comment updated");
            res.redirect("/campgrounds/" + req.params.id) ;
        }
   });
});

//delete comment

router.delete("/:comment_id/delete", middleware.checkCommentOwnership , function(req, res){
   
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id) ;
        }
   });
});


module.exports = router;