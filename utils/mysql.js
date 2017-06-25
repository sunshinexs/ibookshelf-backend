'use strict';

var config = require('../config');

var mysql=require("mysql");  
var pool = mysql.createPool({  
	host: config.mysql_host,
	port: config.mysql_port,
	user: config.mysql_user,
	password: config.mysql_pwd,
	database: config.mysql_database
	// connectionLimit : 10
}); 

exports.pool = pool;
