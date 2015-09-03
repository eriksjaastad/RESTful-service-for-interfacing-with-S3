'use strict';

var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var aws = require('aws-sdk');

/*
* set up Express
*/
var app = express();
app.engine('html', require, require('ejs').renderFile);
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

/*
* load S3 access info
*/
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;


var port = process.env.PORT || 3000;

/*
* setup MongoDB
*/
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/UserPostDB', function(err) {
  if(err) console.log('ERROR: ' + err);
  else console.log('Mongo conndected!');
});

/*
* models
* GET request for /sign_s3
* on request, return JSON containing the temporarily-signed S3 request and the url for the image
*/
var User = require('./app/models/user');

/*
* routes
*/
var router = express.Router();
require('./routes/routes')(routes);

/*
* middleware to be used for all requests
*/
router.use(function(req, res, next) {
  console.log('something is happening');
  next();
});

/*
* test route to make sure it's working
*/
router.get('/', function(req, res) {
  res.json({msg: 'router is working'});
});

/*
* User routes
*/
router.route('/users')
  .post(function(req, res) {
    var user = new User();
    user.name = req.body.name;
    user.save(function(err, data) {
      if(err) {
        console.log(err);
        return res.status(500).json({msg: 'server error with POST'})
      }
      res.json(data);
    });
  })

  .get(function(req, res) {
    User.find(function(err, users) {
      if(err)
        res.send(err);
      res.json(users);
    });
  });

router.route('/users/:user_id')
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if(err)
        res.send(err);
      res.json(user);
    });
  })

  .put(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if(err)
        res.send(err);
      user.name = req.body.name;
      user.save(function(err) {
        if(err)
          res.send(err);
        res.json({msg: 'User updated'});
      });
    });
  })

  .delete(function(req, res) {
    User.remove({
      _id: req.params.user_id
    }, function(err, user) {
      if(err)
        res.send(err);
      res.json({msg: 'User deleted'});
    });
  });

/*
* register routes
*/
app.use('/api', router);

app.listen(port);
console.log('server started on port: ' + port);


// /*
// * GET request for /account
// * on request, render account.html located in /views
// */
// app.get('/account', function(req, res) {
//   res.render('account.html');
// });

// /*
// * GET request for /sign_s3
// * on request, return JSON containing the temporarily-signed S3 request and the url for the image
// */
// app.get('/sign_s3', function(req, res) {
//   aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
//   var s3_params = {
//     Bucket: S3_BUCKET,
//     Key: req.query.file_name,
//     Expires: 60,
//     ContentType: req.query.file_type,
//     ACL: 'public-read'
//   };
//   s3.getSignedUrl('putObject', s3_params, function(err, data) {
//     if(err) {console.log(err);}
//     else {
//       var return_data = {
//         signed_request: data,
//         url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + req.query.file_name
//       };
//       res.write(JSON.stringify(return_data));
//       res.end();
//     }
//   });
// });

// /*
// * POST request to /submit_form
// */
// app.post('/submit_form', function(req, res) {
//   username = req.body.username;
//   full_name = req.body.full_name;
//   avatar_url = req.body.avatar_url;
//   update_account(username, full_name, avatar_url);
// });
