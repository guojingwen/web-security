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

exports.post = async function(ctx, next){
  try{
    console.log('enter post');
    const id = ctx.params.id;
    const connection = connectionModel.getConnection();
    const query = bluebird.promisify(connection.query.bind(connection));
    const posts = await query(
      `select * from post where id = "${id}"`
    );
    let post = posts[0];

    const comments = await query(
      `select comment.*,user.username from comment left join user on comment.userId = user.id where postId = "${post.id}" order by comment.createdAt desc`
    );
    ctx.body = {
      code: 0,
      post,
      comments
    }
    connection.end();
  }catch(e){
    console.log('[/site/post] error:', e.message, e.stack);
    ctx.body = {
      status: e.code || -1,
      body: e.message
    };
  }
};

exports.addComment = async function(ctx, next){
  try{
    const data = ctx.request.body;
    const connection = connectionModel.getConnection();
    const query = bluebird.promisify(connection.query.bind(connection));
    const result = await query(
      `insert into comment(userId,postId,content,createdAt) values("${ctx.cookies.get('userId')}", "${data.postId}", "${data.content}",${connection.escape(new Date())})`
    );
    console.log(result)
    if(result) {
      ctx.body = {
        code: 0,
        message: '添加成功'
      }
    } else {
      ctx.body = {
        code: 0,
        message: 'DB操作失败'
      };
    }
  } catch (e) {
    console.log('[/site/addComment] error:', e.message, e.stack);
    ctx.body = {
      status: e.code || -1,
      body: e.message
    };
  }
};

exports.doLogin = async function(ctx, next){
  try{
    const data = ctx.request.body;
    const connection = connectionModel.getConnection();
    const query = bluebird.promisify(connection.query.bind(connection));
    const results = await query(
      `select * from user where
			username = '${data.username}'
			and password = '${data.password}'`
    );
    if(results.length){
      let user = results[0];

      // 登录成功，设置cookie
      ctx.cookies.set('userId', user.id, {httpOnly: false});
      ctx.body = {
        code: 0,
        data: {
          id: user.id,
          username: user.username
        }
      };
    }else{
      ctx.body = {
        code:  -1,
        body: '登录失败'
      };
    }
    connection.end();
  } catch (e) {
    console.log('[/user/login] error:', e.message, e.stack);
    ctx.body = {
      code: e.code || -1,
      body: e.message
    };
  }
};

exports.getLoginInfo = async function(ctx, next){
  try{
    const userId = ctx.cookies.get('userId');
    const connection = connectionModel.getConnection();
    const query = bluebird.promisify(connection.query.bind(connection));
    const results = await query(
      `select * from user where
			id = ${userId}`
    );
    if (results.length) {
      let user = results[0];
      ctx.body = {
        code: 0,
        data: {
          id: user.id,
          username: user.username
        }
      };
    } else {
      ctx.body = {
        code:  -1,
        body: '获取用户信息失败'
      };
    }
    connection.end();
  } catch(e) {
    console.log('[/getLoginInfo] error:', e.message, e.stack);
    ctx.body = {
      code: e.code || -1,
      body: e.message
    };
  }
}
