//Frameworks and libraries 
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    request = require("request"),
    mongoose = require("mongoose");
    
    
// Unloading the schemas
var Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user");
 
// Uploadin the routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// Uploading the middle
var middleware = require("./middleware");  /* express automatically requires 'index.js' files by default */
    
//Connecting to the Database
mongoose.connect("mongodb://localhost/yelp_camp");


//Setting defaults
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//passport configuration

app.use(require("express-session")({
    secret : "There is no secret to success",
    resave: false,
    saveUninitialized : false
}));

//session initialization
app.use(passport.initialize());
app.use(passport.session());

//passport initialization
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware 
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.use("/", indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)

// Server listen state toggler
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("the Server has started") ;
});



/*************
To be implemented in the future:
    * Error Handling Bug Solution - YelpCamp 
    * different database
    * CSS3 background animation on landing page 
    * Fuzzy Search 
    * Campground location with Google Maps
    * Campground cost
    * Footer 
    * Home link in navigation 
    * Authentication flash messages 
    * Display time since post was created with Moment JS 
    * User profile 
    * Password reset 
    * Image upload with multer and cloudinary 
    * Migration/upgrade instructions for Bootstrap 4
    * Refactor callbacks with Async/Await
*************/