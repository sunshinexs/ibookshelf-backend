var mongoose = require('../utils/mongoose')
var util = require('../utils/util')

var UserInfoSchema = new mongoose.Schema({
	openid: String,
	userInfo: {
		nickName: String,
		gender: Number,
		language: String,
		city: String,
		province: String,
		country: String,
		avatarUrl: String
	},
	config: {
		autoAdd: Boolean
	},
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

UserInfoSchema.pre('save', function(next) {
	if(this.isNew) {
		this.config.autoAdd = false
		this.meta.createAt = this.meta.updateAt = new Date().zoneDate()
	} 
	else {
		this.meta.updateAt = new Date().zoneDate()
	}

	next()
})

module.exports = UserInfoSchema