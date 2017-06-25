'use strict';

var express = require('express');
var app = express();
var userService = require('./service/userservice');
var bookService = require('./service/bookservice');

var log4js = require('log4js')
var log = log4js.getLogger('app');

// 获取openid
app.get('/openid/:code', function(req, res) {
	log.debug('Get /openid')
	userService.getOpenid(req.params.code, function(openid) {
		res.send(openid);
	});
});

// 用户信息
app.route('/userInfo')
	.post(function(req, res) {
		log.debug('Put /userInfo')
		req.on('data', function(userInfo) {
			userService.addUserInfo(userInfo);
		})
	})

// 用户配置操作
app.route('/userConf/:openid')
	.get(function (req, res) {
		log.debug('Get /userConf')
		userService.getUserConf(req.params.openid, function(userConf) {
			res.send(userConf);
		})
	})
	.put(function(req,res) {
		log.debug('Put /userConf')
		req.on('data', function(userConf) {
			userService.updateUserConf(req.params.openid, userConf, function(retInfo) {
				res.send(retInfo);
			});
		})
	})

// 查询用户藏书总数
app.post('/countOwnedBooks', function(req, res) {
	log.debug('Post /countOwnedBooks')
	req.on('data', function(openidStr) {
		var openidJson = JSON.parse(openidStr);
		bookService.countOwnedBooks(openidJson.openid, function(count) {
			res.send(count);
		})
	})
})

// 用户藏书操作
app.route('/ownedbooks')
	.post(function (req, res) {
		log.debug('Post /ownedbooks')
		req.on('data', function(openidStr) {
			var openidJson = JSON.parse(openidStr);
			bookService.getOwnedBooksByLimit(openidJson.openid, openidJson.currentCount, function(ownedBooks) {
				res.send(ownedBooks);
			})
		})
	})
	.put(function(req, res) {
		log.debug('Put  /ownedbooks')
		req.on('data', function(addBookInfo) {
			bookService.addOwnedBooks(addBookInfo, function(retInfo) {
				try{
					res.send(retInfo);
				} catch(err) {
					log.error('addOwnedBooks retErr: ' + err)
				}
			})
		})
	})
	.delete(function(req, res) {
		log.debug('Delete  /ownedbooks')
		req.on('data', function(delBookInfo) {
			bookService.delOwnedBooks(delBookInfo, function(retInfo) {
				res.send(retInfo);
			})
		})
	})

// 判断书籍是否已收藏
app.post('/chkownedbooks/', function(req, res) {
	log.debug('Post /chkownedbooks')
	req.on('data', function (chkInfo) {
		bookService.chkOwnedBooks(chkInfo, function(isOwned) {
			res.send(isOwned);
		});
	})
});

// 查询范围包括：收藏的书籍、用户、好友收藏的书籍
app.post('/search/', function(req, res) {
	log.debug('Get /search')
	req.on('data', function (searchInfo) {
		bookService.getOwnedBooksByName(searchInfo, function(ownedBooks) {
			res.send(ownedBooks);
		});
	})
})

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	log.debug('ibookstore-backend listening at http://%s:%s', host, port);
});