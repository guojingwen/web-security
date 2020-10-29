const mysql = require('mysql');
exports.getConnection = function(){
	let connection = mysql.createConnection({
		host: 'localhost',
		database: (process.env.NODE_ENV === 'production') ? 'safety_new': 'safety',
		port: (process.env.NODE_ENV === 'production') ? '3308': '3306',
		user: 'root',
		password: 'todoDream'
	});
	connection.connect();
	return connection;
};
