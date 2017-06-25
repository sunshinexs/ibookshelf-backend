'use strict';

var config = require('../config');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(config.mongodbUrl); 

module.exports = mongoose