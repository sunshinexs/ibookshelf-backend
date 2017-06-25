'use strict';

var https = require('https')
var async = require('async')
var config = require('../config')
var ownedBooks = require('../dao/ownedbooks4Mysql')
var bookInfo = require('../dao/bookinfo4Mysql')
// var OwnedBooks = require('../modules/ownedbooks')
// var BookInfo = require('../modules/bookinfo')

var log4js = require('../log4js');
var log = log4js.getLogger('app');

var moment = require('moment');

// 查询书籍是否已收藏
exports.chkOwnedBooks = function(chkInfoStr, cb) {
	var chkInfoJson = JSON.parse(chkInfoStr);

	ownedBooks.chkOwnedBooksExist(chkInfoJson.openid, chkInfoJson.isbn13, function(err, isExist) {
		if(err) {
			log.error('chkOwnedBooks error: ' + err)
		} else {
			cb(isExist)
		}
	})

	// OwnedBooks.findOne({openid: chkInfoJson.openid, isbn13:  chkInfoJson.isbn13}, function(err, ownedBook) {
	// 	if(err) {
	// 		log.error(err)
	// 	}

	// 	if(ownedBook == null) {
	// 		cb(false)
	// 	} else {
	// 		cb(true)
	// 	}
	// })
}

// 统计藏书总数
exports.countOwnedBooks = function(openid, cb) {

	ownedBooks.countOwnedBooks(openid, function(err, count) {
		if(err) {
			log.error('countOwnedBooks error: ' + err)
		} else {
			var result = {
				bookListSize: count
			}
			cb(result)
		}
	})

	// var criteria = {openid: openid}; // 查询条件

	// OwnedBooks.count(criteria, function(err, count) {
	// 	if(err) {
	// 		log.error(err)
	// 	} else {
	// 		var result = {
	// 			bookListSize: count
	// 		}
	// 		cb(result)
	// 	}
	// })
}

// 获取用户藏书列表
exports.getOwnedBooksByLimit = function(openid, currentCount, cb) {

	var that = this

	ownedBooks.getOwnedBooksByLimit(openid, currentCount, config.ownedBooks_PageSize, function(err, ownedRows){
		if(err) {
			log.error('getOwnedBooksByLimit err: ' + err)
		} else {
			var bookList = {}
			for(var index in ownedRows) {
				bookList[ownedRows[index].isbn13] = JSON.parse(ownedRows[index].bookinfo)
				bookList[ownedRows[index].isbn13].addAt = moment(ownedRows[index].addAt).format('YYYY-MM-DD')
			}
			cb(bookList)
		}
	})

	// var criteria = {openid: openid}; // 查询条件
	// var fields   = {_id: 0, isbn13: 1, addAt: 1}; // 待返回的字段
	// var options  = {sort: {addAt: -1}, skip: currentCount, limit: config.ownedBooks_PageSize};

	// OwnedBooks.find(criteria, fields, options, function(err, ownedBooks) {
	// 	if(err) {
	// 		log.error(err)
	// 	}
		
	// 	// 添加书籍信息
	// 	var bookListSize = 0
	// 	var bookList = {}
	// 	for(var index in ownedBooks) {
	// 		bookList[ownedBooks[index].isbn13] = {addAt: ownedBooks[index].addAt}
	// 		that.getBookInfo(ownedBooks[index].isbn13, function(_bookInfo) {
	// 			bookListSize++
	// 			var addAt = bookList[_bookInfo.bookInfo.isbn13].addAt
	// 			bookList[_bookInfo.bookInfo.isbn13] = _bookInfo.bookInfo
	// 			bookList[_bookInfo.bookInfo.isbn13].addAt = addAt
	// 			if(bookListSize == ownedBooks.length) {
	// 				cb(bookList)
	// 			}
	// 		})
	// 	}
	// })
}

// 获取用户翻页图书信息，分别调用用户总数和用户藏书信息
// exports.queryOwnedBooksByLimits = function(openid, currentCount, cb) {

// 	var that = this

// 	async.parallel([
// 		function(callback) {
// 			that.countOwnedBooks(openid, callback)
// 		},
// 		function(callback) {
// 			that.getOwnedBooks(openid, currentCount, callback)
// 		}], 
// 		function(err, results) {
// 			console.log(results[0])
// 		}
// 	); 
// }

// 按书名查找用户藏书
exports.getOwnedBooksByName = function(searchInfoStr, cb) {
	var that = this
	var searchInfoJson = JSON.parse(searchInfoStr);

	ownedBooks.getOwnedBooksByName(searchInfoJson.openid, searchInfoJson.searchInfo, function(err, searchOwnedRows){
		if(err) {
			log.error('getOwnedBooksByName err: ' + err)
		} else {
			var bookList = {}
			for(var index in searchOwnedRows) {
				bookList[searchOwnedRows[index].isbn13] = JSON.parse(searchOwnedRows[index].bookinfo)
				bookList[searchOwnedRows[index].isbn13].addAt = moment(searchOwnedRows[index].addAt).format('YYYY-MM-DD')
			}
			cb(bookList)
		}
	})

	// // 查找用户藏书isbn13列表
	// var criteria = {openid: searchInfoJson.openid}; // 查询条件
	// var fields   = {_id: 0, isbn13: 1, addAt: 1}; // 待返回的字段

	// OwnedBooks.find(criteria, fields, null, function(err, ownedBooksIsbn) {
	// 	//不区分大小写
	// 	var title = new RegExp(searchInfoJson.searchInfo, 'i') 

	// 	// 构建isbn数组
	// 	var isbnList = []
	// 	var addAtList = {}
	// 	for(var index in ownedBooksIsbn) {
	// 		isbnList.push(ownedBooksIsbn[index].isbn13)
	// 		addAtList[ownedBooksIsbn[index].isbn13] = ownedBooksIsbn[index].addAt
	// 	}

	// 	BookInfo.find({'bookInfo.title': {$regex: title}, 'isbn13': {$in: isbnList}}, function(err, ownedBooks) {
	// 		if(err) {
	// 			log.error(err)
	// 			cb(err)
	// 		}

	// 		var bookList = {}
	// 		for(var index in ownedBooks) {
	// 			bookList[ownedBooks[index].isbn13] = ownedBooks[index].bookInfo
	// 			bookList[ownedBooks[index].isbn13].adddate = moment(addAtList[ownedBooks[index].isbn13]).format('YYYY-MM-DD')
	// 		}
	// 		cb(bookList)
	// 	})
	// })
}

// 新增用户藏书
exports.addOwnedBooks = function(addBookInfoStr, cb) {
	var addBookInfoJson
	try {
		addBookInfoJson = JSON.parse(addBookInfoStr)
	} catch(err) {
		var retInfo = {
			retCode: 99,
			retMsg: '图书信息解析失败'
		}
		log.error(retInfo.retMsg + ': [' + err + ']')
		cb(retInfo)
		return
	}

	ownedBooks.addOwnedBooks(addBookInfoJson.openid, addBookInfoJson.isbn13, function(err, result) {
		if(err) {
			log.error('addOwnedBooks err: ' + err)
		} else {
			// 查询返回添加日期
			ownedBooks.getOwnedBookByISBN(addBookInfoJson.openid, addBookInfoJson.isbn13, function(err, ownedBook) {
				if (err) {
					log.error('getOwnedBookByISBN err: ' + err)
				} else {
					var retInfo = {
						retCode: 0,
						addAt: ownedBook.addAt
					}
					cb(retInfo)
				}
			})

			// 判断书籍详细信息是否已存储，若未存储则添加
			bookInfo.chkBookinfoExist(addBookInfoJson.isbn13, function(err, isExist) {
				if (err) {
					log.error('chkBookinfoExist err: ' + err)
				} else {
					if(!isExist) {
						bookInfo.addBookinfo(addBookInfoJson, function(err, result) {
							if (err) {
								log.error('addBookinfo err: ' + err)
							}
						})
					}
				}
			})
		}
	})

	// OwnedBooks.findOne({openid: addBookInfoJson.openid, isbn13:  addBookInfoJson.isbn13}, function(err, addBookInfo) {
	// 	if(err) {
	// 		log.error(err)
	// 	}
	// 	if(addBookInfo == null) {
	// 		// 新增用户藏书表
	// 		var _ownedbooks = new OwnedBooks({
	// 			openid: addBookInfoJson.openid,
	// 			isbn13:  addBookInfoJson.isbn13,
	// 			addAt: new Date().zoneDate()
	// 		})
	// 		_ownedbooks.save(function(err) {
	// 			if(err) {
	// 				log.error(err)
	// 			} else {
	// 				cb(_ownedbooks.addAt);
	// 			}
	// 		})

	// 		// 新增书籍信息
	// 		BookInfo.findOne({isbn13:  addBookInfoJson.isbn13}, function(err, bookInfo) {
	// 			if(err) {
	// 				log.error(err)
	// 			}
	// 			if(bookInfo == null) {
	// 				var _bookInfo = new BookInfo({
	// 					isbn13: addBookInfoJson.isbn13,
	// 					bookInfo: addBookInfoJson.bookinfo
	// 				})
	// 				_bookInfo.save(function(err) {
	// 					if(err) {
	// 						log.error(err)
	// 					}
	// 				})
	// 			}
	// 		})
	// 	} else {
	// 		cb(addBookInfo.addAt);
	// 	}
	// })
}

// 删除用户藏书
exports.delOwnedBooks = function(delBookInfoStr, cb) {
	var delBookInfoJson = JSON.parse(delBookInfoStr);

	ownedBooks.delOwnedBooks(delBookInfoJson.openid, delBookInfoJson.isbn13, function(err, result) {
		if (err) {
			log.error('delOwnedBooks err: ' + err)
		} else {
			var retInfo = {
				retCode: 0,
				retMsg: '删除成功'
			};
			cb(retInfo);
		}
	})

	// OwnedBooks.remove({openid: delBookInfoJson.openid, isbn13:  delBookInfoJson.isbn13}, function(error) {
	// 	if(error) {
	// 		console.log(error);
	// 	} else {
	// 		var retInfo = {
	// 			'retCode': '0',
	// 			'retMsg': '删除成功'
	// 		};
	// 		cb(retInfo);
	// 	}
	// })
}

// 获取图书信息
// exports.getBookInfo = function(isbn13, cb) {
// 	BookInfo.findOne({isbn13:  isbn13}, {_id: 0, bookInfo: 1}, function(err, bookInfo) {
// 		if(err) {
// 			log.error(err)
// 		}
// 		cb(bookInfo)
// 	})
// }