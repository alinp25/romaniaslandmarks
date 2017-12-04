var express     = require("express");
var router      = express.Router({mergeParams: true});
var Landmark  = require("../models/landmark");
var Comment     = require("../models/comment");
var middleware   = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Landmark.findById(req.params.id, function(err, landmark) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {landmark});
        }
    })
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res) {
    Landmark.findById(req.params.id, function(err, landmark) {
       if (err) {
           console.log(err);
           res.redirect("/landmarks");
       } else {
           Comment.create(req.body.comment, function(err, comment) {
               if (err) {
                   req.flash("error", "Something went wrong");
                   console.log(err);
               } else {
                   // Add username and id to comment
                   comment.author.id = req.user._id;  
                   comment.author.username = req.user.username;
                   // Save comment
                   comment.save();
                   landmark.comments.push(comment);
                   landmark.save();
                   console.log("Comment added on " + landmark.name);
                   req.flash("success", "Successfully added comment!");
                   res.redirect("/landmarks/" + landmark._id);
               }
           })
       }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comm) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit", {
                landmark_id: req.params.id,
                comment: comm
            });
        }
    })
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/landmarks/" + req.params.id);
       }
   }); 
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err) {
       if (err) {
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted!");
           res.redirect("/landmarks/" + req.params.id);
       }
   }) 
});

module.exports = router;