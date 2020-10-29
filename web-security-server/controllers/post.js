const connectionModel = require('../models/connection');
const bluebird = require('bluebird');
const FilterXSS = require('xss')
const Utils = require('../utils')

exports.index = async function(ctx, next){
  try {
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
      from: ctx.query.from || '',
      message: '成功'
    };
    connection.end();
  } catch (e) {
    console.log('[/site/post] error:', e.message, e.stack);
    ctx.body = {
      code: e.code || -1,
      message: '系统错误'
    };
  }
};

exports.post = async function(ctx, next){
  try{
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
      comments,
      message: '成功'
    }
    connection.end();
  } catch (e) {
    console.log('[/site/post] error:', e.message, e.stack);
    ctx.body = {
      code: e.code || -1,
      message: '获取文章内容失败'
    };
  }
};

exports.addComment = async function(ctx, next){
  try{
    const data = ctx.request.body;
    if(!data.postId) {
      return ctx.body = {
        code: 1,
        message: '文章id不能为空'
      };
    }
    if(!data.content || !data.content.trim()) {
      return ctx.body = {
        code: 1,
        message: '内容不能为空'
      };
    }
    if (!data.captcha || !data.captcha.trim()) {
      return ctx.body = {
        code: 1,
        message: '验证码不能为空'
      }
    }
    const key = ctx.cookies.get('captcha')
    const realCaptcha = Utils.getCacheByKey(key)
    Utils.delCacheByKey(key)
    if(data.captcha.toLowerCase() !== realCaptcha) {
      return ctx.body = {
        code: 1,
        message: '验证码错误'
      }
    }
    const connection = connectionModel.getConnection();
    const query = bluebird.promisify(connection.query.bind(connection));
    const result = await query(
      `insert into comment(userId,postId,content,createdAt) values("${ctx.cookies.get('userId')}", "${data.postId}", "${FilterXSS(data.content.trim())}",${connection.escape(new Date())})`
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
      code: e.code || -1,
      message: '系统错误'
    };
  }
};
