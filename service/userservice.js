'use strict';

var https = require('https')
// var UserInfo = require('../modules/userinfo')
var userinfo = require('../dao/userinfo4Mysql')

var config = require('../config');

var log4js = require('../log4js');
var log = log4js.getLogger('app');

// 获取当前登陆用户openid
exports.getOpenid = function(code, cb) {
	var options = {
		hostname: 'api.weixin.qq.com',  
		path: '/sns/jscode2session?appid=' + config.appid + '&secret=' + config.appsecret + '&js_code=' + code + '&grant_type=authorization_code',  
	}
	
	https.get(options, function (res) {
		res.on('data', function (dataStr) {
			var dataJson = JSON.parse(dataStr);

			//判断是否已记录该用户信息
			var cbdata = {
				openid: dataJson.openid,
				isNew: false
			}
			userinfo.chkUserExist(dataJson.openid, function(err, isExist) {
				if(!isExist) {
					cbdata.isNew = true
				}

				cb(cbdata)
			})

			// MongoDB
			// UserInfo.findOne({openid: dataJson.openid}, function(err, userInfo) {
			// 	if(err) {
			// 		log.error(err)
			// 	}
			// 	var isNew = false
			// 	var cbdata = {
			// 		openid: dataJson.openid,
			// 		isNew: isNew
			// 	}
			// 	if(userInfo == null || userInfo.length == 0) {
			// 		cbdata.isNew = true
			// 		var _userInfo = new UserInfo({
			// 			openid: dataJson.openid
			// 		})
			// 		_userInfo.save(function(err) {
			// 			if(err) {
			// 				log.error(err)
			// 			} else {
			// 				cb(cbdata);
			// 			}
			// 		})
			// 	} else {
			// 		cb(cbdata);
			// 	}
			// })
		}).on('error', function (e) {
			log.error('problem with request: ' + e.message);  
		});
	});
}

// 新增用户
exports.addUserInfo = function(userInfoStr) {
	var userInfoJson = JSON.parse(userInfoStr);

	userinfo.addUser(userInfoJson, function(err, result) {
		if(err) {
			log.error('addUserInfo error: ' + err)
		}
	})
	// UserInfo.findOne({openid: userInfoJson.openid}, function(err, _userInfo) {
	// 	if(err) {
	// 		log.error(err)
	// 	}
	// 	_userInfo.set({userInfo: userInfoJson.userInfo})
	// 	_userInfo.save()
	// })
}

// 获取用户配置
exports.getUserConf = function(openid, cb) {
	userinfo.getUserConf(openid, function(err, config) {
		if(err) {
			log.error('getUserConf error' + err)
		} else {
			cb(config)
		}
	})

	// UserInfo.findOne({openid: openid}, function(err, userInfo) {
	// 	if(err) {
	// 		log.error(err)
	// 	}
	// 	cb(userInfo.config);
	// })
}

// 更新用户配置
exports.updateUserConf = function(openid, userConfStr, cb) {
	var userConfJson = JSON.parse(userConfStr);

	userinfo.updateUserConf(openid, userConfJson, function(err, result) {
		if(err) {
			log.error('updateUserConf error: ' + err)
		} else {
			var retInfo = {
				'retCode': '0',
				'retMsg': '修改成功'
			}
			cb(retInfo)
		}
	})
	// UserInfo.findOne({openid: openid}, function(err, userInfo) {
	// 	if(err) {
	// 		log.error(err)
	// 	}
	// 	userInfo.set({config: {autoAdd: userConfJson.autoAdd}})
	// 	userInfo.save()

	// 	var retInfo = {
	// 		'retCode': '0',
	// 		'retMsg': '修改成功'
	// 	}
	// 	cb(retInfo);
	// })
}