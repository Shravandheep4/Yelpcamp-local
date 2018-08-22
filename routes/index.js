var express = require("express"),
    router =express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    passport = require("passport"),
    User = require("../models/user");

var middleware = require("../middleware");  /* express automatically requires 'index.js' files by default */


//landing page
router.get("/",function(req, res){
    res.render("landing");
});





/*************
 Auth Routes
*************/

router.get("/register", function(req, res) {
    res.render("register");
})

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error",err.message)
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","Welcome to Yelpcamp, " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//Login

router.get("/login", function(req, res) {
   res.render("login");
});


router.post("/login", function (req, res, next) {
  passport.authenticate("local",
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: "Welcome to YelpCamp, " + req.body.username + "!"
    })(req, res);
});


//logout

router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success","logged out");
   res.redirect("/campgrounds");
});

module.exports = router;