'use strict';

/**
userInfo: {
	openid: 用户微信openid,
	userInfo_nickName: 昵称,
	userInfo_gender: 性别,
	userInfo_province: 省份,
	userInfo_city: 城市/区,
	userInfo: 用户信息（JSON）,
	config_autoAdd: 是否扫码自动添加书籍,
	meta_createAt: 注册日期,
	meta_updateAt: 修改日期
}
{
    "openid" : "o7hv80CClcM9qz9YBE_AUyr6GqA0",
    "meta" : {
        "updateAt" : ISODate("2017-06-05T22:50:11.386Z"),
        "createAt" : ISODate("2017-06-04T23:53:24.401Z")
    },
    "config" : {
        "autoAdd" : true
    },
    "userInfo" : {
        "avatarUrl" : "http://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEL20icGrpRSC70UFQ6IbicL3hVibmhduSnRMz9VTEP7W08ZT6QEZRL3TDjZCxeUoGjAq6k5gxjNpIPTw/0",
        "city" : "West",
        "country" : "CN",
        "gender" : 1,
        "language" : "zh_CN",
        "nickName" : "SunShine",
        "province" : "Beijing"
    }
}
*/
var pool = require('../utils/mysql').pool;

// 判断用户是否存在
exports.chkUserExist = function(openid, cb) {
	var chkUserSql = 'select 1 from userinfo where openid = ? limit 1';
	var chkUserSql_Params = [openid];
	pool.query(chkUserSql, chkUserSql_Params, function(err, rows, fields) {
		if (err) {
			cb(err, null)
		} else {
			if(rows.length > 0) {
				cb(err, true);
			} else{
				cb(err, false);
			}
		}
	});
}

// 查询用户
exports.getUser = function(openid, cb) {
	var userQuerySql = 'select * from userinfo where openid = ? limit 1';
	var userQuerySql_Params = [openid];
	pool.query(userQuerySql, userQuerySql_Params, function(err, rows, fields) {
		if (err) {
			cb(err, null)
		} else {
			cb(err, rows);
		}
	});
}

// 新增用户
exports.addUser = function(userInfoJson, cb) {
	var userAddSql = 'insert into userinfo(openid, userInfo_nickName, userInfo_gender, userInfo_province, userInfo_city, userInfo) values (?, ?, ?, ?, ?, ?)'
	var userAddSql_Params = [userInfoJson.openid, userInfoJson.userInfo.nickName, userInfoJson.userInfo.gender, userInfoJson.userInfo.province, userInfoJson.userInfo.city, JSON.stringify(userInfoJson.userInfo)]

	pool.query(userAddSql, userAddSql_Params, function(err, result) {
		if (err) {
			cb(err, null)
		} else {
			cb(err, result)
		}
	});
}

// 获取用户配置
exports.getUserConf = function(openid, cb) {

	var that = this
	var config = {
		autoAdd: false
	}

	that.getUser(openid, function(err, rows) {
		if(err) {
			cb(err, null)
		} else {
			if(rows.length > 0) {
				config.autoAdd = rows[0].config_autoAdd
			}
			cb(err, config)
		}
	})
}

// 更新用户配置
exports.updateUserConf = function(openid, userConfJson, cb) {
	var userConfUpdateSql = 'update userinfo set config_autoAdd = ? where openid = ?';
	var userConfUpdateSql_Params = [userConfJson.autoAdd, openid];
	pool.query(userConfUpdateSql, userConfUpdateSql_Params, function(err, result) {
  		if (err) {
  			cb(err, null)
  		} else {
  			cb(err, result)
  		}
	})
}