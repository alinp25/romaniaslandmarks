var mongoose = require("mongoose"),
    Landmark = require("./models/landmark"),
    Comment = require("./models/comment");
   
var data = [ {
        name: "Cloud's Rest",
        image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae dui sed est volutpat finibus. Aliquam erat volutpat. Nam augue dui, posuere dignissim lacinia sit amet, aliquam nec ex. Donec commodo, tortor consequat imperdiet dictum, ipsum magna auctor purus, lobortis pharetra lacus metus ac eros. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed auctor vehicula ligula ut volutpat. Proin in ipsum id quam placerat imperdiet eu vitae ligula."
    }, {
        name: "City Break CG",
        image: "https://farm3.staticflickr.com/2464/3694344957_14180103ed.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae dui sed est volutpat finibus. Aliquam erat volutpat. Nam augue dui, posuere dignissim lacinia sit amet, aliquam nec ex. Donec commodo, tortor consequat imperdiet dictum, ipsum magna auctor purus, lobortis pharetra lacus metus ac eros. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed auctor vehicula ligula ut volutpat. Proin in ipsum id quam placerat imperdiet eu vitae ligula."
    }, {
        name: "OYO",
        image: "https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae dui sed est volutpat finibus. Aliquam erat volutpat. Nam augue dui, posuere dignissim lacinia sit amet, aliquam nec ex. Donec commodo, tortor consequat imperdiet dictum, ipsum magna auctor purus, lobortis pharetra lacus metus ac eros. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed auctor vehicula ligula ut volutpat. Proin in ipsum id quam placerat imperdiet eu vitae ligula."
    }
];
   
function seedDB() { 
    // Remove all landmarks
    Landmark.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            // Add a few landmarks
            data.forEach(function(seed) {
                Landmark.create(seed, function(err, landmark) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Added a landmark");
                        // Add a few comments
                        Comment.create({
                            text: "This place is great, but I wish there was internet.",
                            author: "Homer"
                        }, function(err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                landmark.comments.push(comment);
                                landmark.save();
                                console.log("Created new comment");
                            }
                        });
                    }
                })
            });
        }
    });
}

module.exports = seedDB;