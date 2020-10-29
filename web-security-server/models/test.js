const mysql = require('mysql')
const bluebird = require('bluebird');

function getConnection(){
  let connection = mysql.createConnection({
    host: 'localhost',
    database: 'safety_new',
    port: '3308',
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
exec()
