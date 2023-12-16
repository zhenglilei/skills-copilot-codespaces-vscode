// Create web server application

// Load modules
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb://localhost/commentdb');

// Create the schema
var commentSchema = mongoose.Schema({name: String, comment: String});

// Create the model
var Comment = mongoose.model('Comment', commentSchema);

// Create the application
var app = express();

// Configure the application
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// Create the router
var router = express.Router();

// Configure the router
router.route('/comments')
  .post(function(request, response) {
    var comment = new Comment();
    comment.name = request.body.name;
    comment.comment = request.body.comment;
    comment.save(function(error) {
      if (error)
        response.send(error);
      response.json({message: 'Comment successfully added!'});
    });
  })
  .get(function(request, response) {
    Comment.find(function(error, comments) {
      if (error)
        response.send(error);
      response.json(comments);
    });
  });

// Register the routes
app.use('/api', router);

// Start the server
app.listen(8080);
console.log('Listening on port 8080');