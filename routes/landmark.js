var express      = require("express");
var router       = express.Router();
var Landmark   = require("../models/landmark");
var middleware   = require("../middleware");

// Landmarks
router.get("/", function(req, res) {
    Landmark.find({}, function(err, landmarks) {
        if (err) {
            console.log(err);
        } else {
            res.render("landmarks/index", {landmarks});
        }
    });
});

// New Landmark
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newLandmark = {name, image, description, author, price};
    Landmark.create(newLandmark, function(err, cg) {
        if (err) {
            console.log("err");
        } else {
            
            console.log("Landmark '" + newLandmark.name + "' created by " + newLandmark.author.username);
            res.redirect("/landmarks");
        }
    })
});

// New Landmark Form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("landmarks/new");
})

// Get Route By ID
router.get("/:id", function(req, res) {
    Landmark.findById(req.params.id).populate("comments").exec(function(err, foundLandmark) {
       if (err) {
           console.log(err);
       } else {
            res.render("landmarks/show", {landmark: foundLandmark});
       }
    });
});

// EDIT LANDMARK ROUTE
router.get("/:id/edit", middleware.checkLandmarkOwnership, function(req, res) {
    Landmark.findById(req.params.id, function(err, landmark) {
        if (err) {
            req.flash("error", "Landmark doesn't exist");
        }
        res.render("landmarks/edit", {landmark});
    }); 
});

// UPDATE CAMPGGROUND ROUTE
router.put("/:id", middleware.checkLandmarkOwnership, function(req, res) {
    Landmark.findByIdAndUpdate(req.params.id, req.body.landmark, function(err, updatedLandmark) {
       if (err) {
           res.redirect("/landmarks");
       } else {
           res.redirect("/landmarks/" + req.params.id);
       }
    });
});

// DESTROY Landmark
router.delete("/:id", middleware.checkLandmarkOwnership, function(req, res) {
    Landmark.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("success", "Landmark deleted!");
            res.redirect("/landmarks");
        } else {
            res.redirect("/landmarks");
        }
    })
});

module.exports = router;