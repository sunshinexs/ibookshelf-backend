'use strict';

/**
ownedbooks: {
	openid: 用户微信openid,
	isbn13: 藏书ISBN号,\
	addAt: 添加日期
}
{
    "openid" : "o7hv80CClcM9qz9YBE_AUyr6GqA0",
    "isbn13" : "9787115335500",
    "addAt" : ISODate("2017-06-06T00:18:26.258Z"),
}
*/

var pool = require('../utils/mysql').pool;

// 判断图书是否已收藏
exports.chkOwnedBooksExist = function(openid, isbn13, cb) {
	var chkOwnedBooksExistSql = 'select 1 from ownedbooks where openid = ? and isbn13 = ? limit 1';
	var chkOwnedBooksExistSql_Params = [openid, isbn13];
	pool.query(chkOwnedBooksExistSql, chkOwnedBooksExistSql_Params, function(err, rows, fields) {
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

// 统计藏书总数
exports.countOwnedBooks = function(openid, cb) {
	var countOwnedBooksSql = 'select count(openid) as count from ownedbooks where openid = ?';
	var countOwnedBooksSql_Params = [openid];
	pool.query(countOwnedBooksSql, countOwnedBooksSql_Params, function(err, rows, fields) {
		if (err) {
			cb(err, null)
		} else {
			cb(err, rows[0].count);
		}
	});
}

// 查询用户藏书列表
exports.getOwnedBooksByLimit = function(openid, pageFrom, pageSize, cb) {
	var ownedBooksQuerySql = 'select ob.isbn13, ob.addAt, b.bookinfo from ownedbooks ob, bookinfo b where ob.openid = ? and ob.isbn13 = b.isbn13 order by ob.addAt desc limit ?, ?';
	var ownedBooksQuerySql_Params = [openid, pageFrom, pageSize];
	pool.query(ownedBooksQuerySql, ownedBooksQuerySql_Params, function(err, rows, fields) {
		if (err) {
			cb(err, null)
		} else {
			cb(err, rows);
		}
	});
}

// 查询用户藏书信息 by ISBN
exports.getOwnedBookByISBN = function(openid, isbn13, cb) {
	var ownedBooksQuerySql = 'select ob.isbn13, ob.addAt, b.bookinfo from ownedbooks ob left join bookinfo b on ob.isbn13 = b.isbn13 where ob.openid = ? and ob.isbn13 = ? limit 1';
	var ownedBooksQuerySql_Params = [openid, isbn13];
	pool.query(ownedBooksQuerySql, ownedBooksQuerySql_Params, function(err, rows, fields) {
		if (err) {
			cb(err, null)
		} else {
			cb(err, rows[0]);
		}
	})
}

// 查询用户藏书列表 by 书名
exports.getOwnedBooksByName = function(openid, searchInfo, cb) {
	var ownedBooksQuerySql = 'select ob.isbn13, ob.addAt, b.bookinfo from ownedbooks ob, bookinfo b where ob.openid = ? and ob.isbn13 = b.isbn13 and b.bookInfo_title like ? order by ob.addAt';
	var ownedBooksQuerySql_Params = [openid, '%' + searchInfo + '%'];
	pool.query(ownedBooksQuerySql, ownedBooksQuerySql_Params, function(err, rows, fields) {
		if (err) {
			cb(err, null)
		} else {
			cb(err, rows);
		}
	})
}

// 新增藏书信息
exports.addOwnedBooks = function(openid, isbn13, cb) {
	var addOwnedBookSql = 'insert into ownedbooks(openid, isbn13) values (?, ?)'
	var addOwnedBookSql_Params = [openid, isbn13]

	pool.query(addOwnedBookSql, addOwnedBookSql_Params, function(err, result) {
		if (err) {
			cb(err, null)
		} else {
			cb(err, result)
		}
	})
}

// 删除藏书信息
exports.delOwnedBooks = function(openid, isbn13, cb) {
	var delOwnedBooksSql = 'delete from ownedbooks where openid = ? and isbn13 = ?';
	var delOwnedBooksSql_Params = [openid, isbn13];
	pool.query(delOwnedBooksSql, delOwnedBooksSql_Params, function(err, result) {
  		if (err) {
			cb(err, null)
		} else {
			cb(err, result)
		}
	});
}