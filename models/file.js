'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileSchema = new Schema({
  name: {type: String, unique: true},
  body: String,
});

module.exports = mongoose.model('File', fileSchema);
