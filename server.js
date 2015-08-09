'use strict';
/*
* import packages
*/
var express = require('express');
var http = require('http');
var path = require('path');
var aws = require('aws-sdk');

/*
* set up Express
*/
var app = express();
app.set('views', __dirname + '/views');
app.engine('html', require, require('ejs').renderFile);
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

/*
* load S3 access info
*/
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

/*
* GET request for /account
* on request, render account.html located in /views
*/
app.get('/account', function(req, res) {
  res.render('account.html');
});

/*
* GET request for /sign_s3
* on request, return JSON containing the temporarily-signed S3 request and the url for the image
*/
app.get('/sign_s3', function(req, res) {
  aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
  var s3_params = {
    Bucket: S3_BUCKET,
    Key: req.query.file_name,
    Expires: 60,
    ContentType: req.query.file_type,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3_params, function(err, data) {
    if(err) {console.log(err);}
    else {
      var return_data = {
        signed_request: data,
        url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + req.query.file_name
      };
      res.write(JSON.stringify(return_data));
      res.end();
    }
  });
});

/*
* POST request to /submit_form
*/
app.post('/submit_form', function(req, res) {
  username = req.body.username;
  full_name = req.body.full_name;
  avatar_url = req.body.avatar_url;
  update_account(username, full_name, avatar_url);
})

app.listen(app.get('port'));
