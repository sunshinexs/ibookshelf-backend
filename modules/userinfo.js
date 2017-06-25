'use strict';

var mongoose = require('../utils/mongoose')
var UserInfoSchema = require('../schemas/userinfo')

var UserInfo = mongoose.model('UserInfo', UserInfoSchema, 'userinfo');

module.exports = UserInfo