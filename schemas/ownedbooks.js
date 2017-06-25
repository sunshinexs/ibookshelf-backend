var mongoose = require('../utils/mongoose')
var util = require('../utils/util')

var OwnedBooksSchema = new mongoose.Schema({
	openid: String,
	isbn13: String,
	addAt: {
		type: Date, 
		default: Date.now 
	}
})

OwnedBooksSchema.pre('save', function(next) {
	if(this.isNew) {
		this.addAt = new Date().zoneDate()
	} 

	next()
})

module.exports = OwnedBooksSchema