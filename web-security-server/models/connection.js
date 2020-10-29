const mysql = require('mysql');
exports.getConnection = function(){
	let connection = mysql.createConnection({
		host: (process.env.NODE_ENV === 'production') ? 'localhost:3308': 'localhost',
		database: (process.env.NODE_ENV === 'production') ? 'safety_new': 'safety',
		user: 'root',
		password: 'todoDream'
	});
	connection.connect();
	return connection;
};
