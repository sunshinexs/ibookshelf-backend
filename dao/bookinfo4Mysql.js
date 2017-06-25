'use strict';

/**
bookinfo: {
	isbn13: 藏书ISBN号,
	bookInfo_title: 书名,
	bookInfo_publisher: 出版社,
	bookInfo_pubdate: 出版日期,
	bookInfo_price: 价格,
	bookInfo_rating: 豆瓣评分,
	bookInfo_author: 作者（JSON）,
	bookInfo_translator: 译者（JSON）,
	bookInfo_tags: 标签（JSON）,
	bookInfo: 图书信息（JSON）,
	meta_createAt: 登记日期,
	meta_updateAt: 修改日期
}
*/

var pool = require('../utils/mysql').pool;

// 判断图书信息是否存在
exports.chkBookinfoExist = function(isbn13, cb) {
	var chkBookinfoSql = 'select 1 from bookinfo where isbn13 = ? limit 1';
	var chkBookinfoSql_Params = [isbn13];
	pool.query(chkBookinfoSql, chkBookinfoSql_Params, function(err, rows, fields) {
		if (err) {
			cb(err, null)
		} else {
			if(rows.length > 0) {
				cb(err, true)
			} else{
				cb(err, false)
			}
		}
	})
}

// 新增图书信息
exports.addBookinfo = function(addBookInfoJson, cb) {
	var addBookinfoSql = 'insert into bookinfo(isbn13, bookInfo_title, bookInfo_publisher, bookInfo_pubdate, bookInfo_price, bookInfo_rating, bookInfo_author, bookInfo_translator, bookInfo_tags, bookInfo) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
	var addBookinfoSql_Params = [addBookInfoJson.isbn13, addBookInfoJson.bookinfo.title, addBookInfoJson.bookinfo.publisher, addBookInfoJson.bookinfo.pubdate, addBookInfoJson.bookinfo.price, addBookInfoJson.bookinfo.rating.average, JSON.stringify(addBookInfoJson.bookinfo.author), JSON.stringify(addBookInfoJson.bookinfo.translator), JSON.stringify(addBookInfoJson.bookinfo.tags), JSON.stringify(addBookInfoJson.bookinfo)]

	pool.query(addBookinfoSql, addBookinfoSql_Params, function(err, result) {
		if (err) {
			cb(err, null)
		} else {
			cb(err, result)
		}
	})
}