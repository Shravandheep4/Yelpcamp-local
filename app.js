//Frameworks and libraries 
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    request = require("request"),
    mongoose = require("mongoose");
    
    
// Unloading the schemas
var Campground = require("./models/campground"),
    Comment = require("./models/comment");
    
//Connecting to the Database
mongoose.connect("mongodb://localhost/yelp_camp");


//Setting defaults
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


//Routes...

//landing page
app.get("/",function(req, res){
    res.render("landing");
});


//index page
app.get("/campgrounds", function(req, res){
    
    Campground.find({},function(err,AllCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:AllCampground});    
        }
    });
        
});



app.post("/campgrounds", function(req, res){
        
    //get data from form and add to campgrounds array
        var name = req.body.name;
        var image = req.body.image;
        var description = req.body.description;
        var newCampground = {name: name, image: image, description: description};
        
    //store data in the DB
    
        Campground.create(newCampground,function(err,newCampground){
            if(err){
                console.log(err);
            }else{  
                console.log("New campground created");
            }
        });
    
        res.redirect("/campgrounds");
});


//new create
app.get("/campgrounds/new",function(req, res){
    res.render("campgrounds/new");
});

//show page
app.get("/campgrounds/:id", function(req, res) {
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, campFound){
       if(err) {
           res.redirect("/campgrounds");
       }else{
           res.render("campgrounds/show", {camp: campFound});
       }
    });

});

/*=====================
    Comment Routes
======================*/


app.get("/campgrounds/:id/comments/new", function(req, res) {
   
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});     
        }
        
   })
   
});

app.post("/campgrounds/:id/comments", function(req, res){
    
    Comment.create(req.body.comment, function(err , addedComment){
        if(err){
            console.log(err);
        }else{
            Campground.findById(req.params.id, function(err, campground) {
               if(err) {
                   console.log(err);
               }else{
                   campground.comments.push(addedComment);
                   campground.save();
                   res.redirect("/campgrounds/" + campground._id);
               }
            });
        }
    })
});

// Server listen state toggler
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("the Server has started") ;
});