const connectionModel = require('./models/connection');
const bluebird = require('bluebird');

exports.index = async function(ctx, next){
  const connection = connectionModel.getConnection();
  const query = bluebird.promisify(connection.query.bind(connection));
  const posts = await query(`
    select post.*, 
      count(comment.id) as commentCount 
    from post 
    left join comment 
      on post.id = comment.postId 
    group by post.id limit 10
  `);
  const comments = await query(`
    select comment.*, 
      post.id as postId, 
      post.title as postTitle,
      user.username as username 
    from comment 
    left join post 
      on comment.postId = post.id 
    left join user 
      on comment.userId = user.id 
      order by comment.id 
      desc limit 10
  `);
  ctx.body = {
    code: 0,
    posts,
    comments,
    from: ctx.query.from || ''
  };
  connection.end();
};

exports.post = async function (ctx, next) {
  await next()
  ctx.body = {
    code: 0,
    data: {
      name: 'zs',
      age: 12
    }
  };
}
