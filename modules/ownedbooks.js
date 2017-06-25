'use strict';

var mongoose = require('../utils/mongoose')
var OwnedBooksSchema = require('../schemas/ownedbooks')

var OwnedBooks = mongoose.model('OwnedBooks', OwnedBooksSchema, 'ownedbooks');

module.exports = OwnedBooks