var mongoose = require('../utils/mongoose')
var util = require('../utils/util')

var BookInfoSchema = new mongoose.Schema({
	isbn13: String,
	bookInfo: mongoose.Schema.Types.Mixed,
	meta: {
		createAt: {
			type: Date, 
			default: Date.now 
		},
		updateAt: {
			type: Date, 
			default: Date.now 
		},
	}
})

BookInfoSchema.pre('save', function(next) {
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = new Date().zoneDate()
	} 
	else {
		this.meta.updateAt = new Date().zoneDate()
	}

	next()
})

module.exports = BookInfoSchema