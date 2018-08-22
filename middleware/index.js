var middlewareObj = {};

// Model

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");


middlewareObj.checkOwnership = function(req, res, next){
    
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campFound){
           if(err) {
                req.flash("error","campgroun not found!");
                res.redirect("back");
           }else{
               if(campFound.author.id.equals(req.user._id)){
                    next();
               }else{
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");   
               }
           }
        });
    }else{
         req.flash("error", "")
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error","You have to be logged in");
        res.redirect("/login");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment) {
            if(err){
                res.redirect("back");
            }else{
                if(comment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","you don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
};


module.exports = middlewareObj;