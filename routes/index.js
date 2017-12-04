var express     = require("express");
var router      = express.Router();
var User        = require("../models/user");
var passport    = require("passport");

// Root Route
router.get("/", function(req, res) {
    res.render("landing");
});

// Register form
router.get("/register", function(req, res) {
    res.render("register");
});

// Register
router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to Romania's Landmarks, " + user.username + "!");
            res.redirect("/landmarks");
        })
    });
});

// Login Form
router.get("/login", function(req, res) {
    res.render("login");
});

// Login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/landmarks", 
    failureRedirect: "/login"
}), function(req, res) {
});

// Logout
router.get("/logout", function(req, res) {
    req.flash("success", "Logged you out!");
    req.logout();
    res.redirect("/landmarks");
});

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;