const mysql = require('mysql')
const bluebird = require('bluebird');
console.log(process.env.NODE_ENV)

function getConnection(){
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

async function exec() {
  const connection = getConnection();
  const query = bluebird.promisify(connection.query.bind(connection));
  const posts = await query(`
      select post.*, 
        count(comment.id) as commentCount 
      from post 
      left join comment 
        on post.id = comment.postId 
      group by post.id limit 10
    `);
  console.log(posts)
}
// exec()
