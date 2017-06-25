'use strict';

var mongoose = require('../utils/mongoose')
var BookInfoSchema = require('../schemas/bookinfo')

var BookInfo = mongoose.model('BookInfo', BookInfoSchema, 'bookinfo');

module.exports = BookInfo