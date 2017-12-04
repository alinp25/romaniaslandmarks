var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    seedDb         = require("./seeds"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    Landmark       = require("./models/landmark"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    methodOverride = require("method-override");

// Require route
var commentRoutes        = require("./routes/comments"),
    landmarkRoutes       = require("./routes/landmark"),
    indexRoutes          = require("./routes/index");


mongoose.connect("mongodb://administrator:admin@ds137191.mlab.com:37191/romaniaslandmarksdev", {useMongoClient: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Romania is a beauty country, with awesome landmarks",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/landmarks", landmarkRoutes);
app.use("/landmarks/:id/comments", commentRoutes);

var PORT = process.env.PORT || 8080;

app.listen(PORT, function() {
    console.log("Server is listening on port " + PORT + "...");
});