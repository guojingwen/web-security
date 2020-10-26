const mysql = require('mysql');
exports.getConnection = function(){
	let connection = mysql.createConnection({
		host: 'localhost',
		database: 'safety',
		user: 'root',
		password: 'todoDream'
	});
	connection.connect();
	return connection;
};
