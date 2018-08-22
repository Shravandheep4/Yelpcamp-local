var express = require("express"),
    router =express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    User = require("../models/user");
    
var middleware = require("../middleware");  /* express automatically requires 'index.js' files by default */


/*=====================
    Comment Routes
======================*/

//index page
router.get("/", function(req, res){
    
    // console.log(req.user);
    
    Campground.find({},function(err,AllCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:AllCampground, currentUser: req.user});    
        }
    });
        
});


//new create
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});


router.post("/", middleware.isLoggedIn, function(req, res){
    
    
    //get data from form and add to campgrounds array
        var name = req.body.name;
        var image = req.body.image;
        var description = req.body.description;
        var price = req.body.price;
        var author = {
            id : req.user._id,
            username: req.user.username
        }
        var newCampground = {name: name, image: image, description: description, author: author, price: price};
        
    //store data in the DB
    
        Campground.create(newCampground,function(err,newCampground){
            if(err){
                req.flash("error", err.message);
            }else{  
                console.log("New campground created");
            }
        });
        
        req.flash("success", newCampground.name + " has been added!");
        res.redirect("/campgrounds");
});



//update 

router.get("/:id/edit", middleware.checkOwnership, function(req, res) {
   
        Campground.findById(req.params.id).populate("comments").exec(function(err, campFound){
            if(err) res.redirect("back");
            res.render("campgrounds/edit", {campground: campFound});
        });
    
});


router.put("/:id", middleware.checkOwnership,  function(req, res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           req.flash("success", "Changes have been saved successfully");
           res.redirect("/campgrounds/"+ updatedCampground._id)
       }
   }) ;
});

//delete page

router.delete("/:id", middleware.checkOwnership ,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, DeletedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            req.flash("success", DeletedCampground + " has been deleted");
            res.redirect("/campgrounds");
        }
    });
})

//show page
router.get("/:id", function(req, res) {
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, campFound){
       if(err) {
           res.redirect("/campgrounds");
       }else{
           res.render("campgrounds/show", {camp: campFound});
       }
    });

});

module.exports = router;