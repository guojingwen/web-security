const connectionModel = require('../models/connection');
const bluebird = require('bluebird');
const Utils = require('../utils')

exports.doLogin = async function(ctx, next){
  try{
    const data = ctx.request.body;
    const vResult = validate(data, ctx)
    if(vResult !== true) {
      return ctx.body = vResult
    }

    const connection = connectionModel.getConnection();
    const query = bluebird.promisify(connection.query.bind(connection));

    const results = await query(
      `select * from user where
			username = '${data.username}'`
    );
    if(results.length){
      let user = results[0];
      let frontPassword = Utils.encryptPassword(user.salt, data.password)

      if(frontPassword !== user.password) {
        return ctx.body = {
          code:  -1,
          message: '用户名或密码错误'
        }
      }

      // 登录成功，设置cookie maxAge
      // ctx.cookies.set('userId', user.id, {httpOnly: false/*, sameSite: true*/});
      const sessionKey = Utils.createSessionKey()
      Utils.setSession(sessionKey, user.id)
      ctx.cookies.set('session_user', sessionKey, {httpOnly: false/*, sameSite: true*/})

      ctx.body = {
        code: 0,
        data: {
          id: user.id,
          username: user.username
        },
        message: '登录成功'
      };
    }else{
      ctx.body = {
        code:  -1,
        message: '用户名或密码错误'
      };
    }
    connection.end();
  } catch (e) {
    console.log('[/user/login] error:', e.message, e.stack);
    ctx.body = {
      code: e.code || -1,
      message: '登录失败'
    };
  }
};
exports.doRegister = async function(ctx, next) {
  try{
    const data = ctx.request.body;
    const vResult = validate(data, ctx)
    if(vResult !== true) {
      return ctx.body = vResult
    }

    const connection = connectionModel.getConnection();
    const query = bluebird.promisify(connection.query.bind(connection));
    const salt =  Utils.getSalt()
    const password = Utils.encryptPassword(salt, data.password)
    const results = await query(`insert into user(username, salt, password, createdAt) values("${data.username}", "${salt}", "${password}", ${connection.escape(new Date())})`);

    if(results.insertId) {
      // 登录成功，设置cookie
      // ctx.cookies.set('userId', results.insertId, {httpOnly: false/*, sameSite: true*/});
      const sessionKey = Utils.createSessionKey()
      Utils.setSession(sessionKey, results.insertId)
      ctx.cookies.set('session_user', sessionKey, {httpOnly: false/*, sameSite: true*/})

      ctx.body = {
        code: 0,
        data: {
          id: results.insertId,
          username: data.username
        },
        message: '注册成功'
      };
    } else {
      ctx.body = {
        code:  -1,
        message: '注册失败，请稍后再试'
      };
    }
    connection.end();
  } catch (e) {
    console.log('[/user/login] error:', e.message, e.stack);
    ctx.body = {
      code: e.code || -1,
      message: '系统错误'
    };
  }
}

exports.getLoginInfo = async function(ctx, next){
  try{
    const userId = getUserId(ctx)
    if(!userId) return ctx.body = {
      code: 0,
      data: null,
      message: '未登录'
    }
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
        },
        message: '获取登录信息成功'
      };
    } else {
      ctx.body = {
        code:  -1,
        message: '获取登录信息失败'
      };
    }
    connection.end();
  } catch(e) {
    console.log('[/getLoginInfo] error:', e.message, e.stack);
    ctx.body = {
      code: e.code || -1,
      message: '系统错误'
    };
  }
}

function validate ({username, password, captcha}, ctx) {
  if(!username) {
    return {
      code: 1,
      message: '用户名不能为空'
    }
  }
  if (!password) {
    return {
      code: 1,
      message: '密码不能为空'
    }
  }
  if (!captcha || !captcha.trim()) {
    return {
      code: 1,
      message: '验证码不能为空'
    }
  }
  const key = ctx.cookies.get('captcha')
  const realCaptcha = Utils.getCacheByKey(key)

  Utils.delCacheByKey(key)
  if(captcha.toLowerCase() !== realCaptcha) {
    return {
      code: 1,
      message: '验证码错误'
    }
  }
  return true
}

function getUserId (ctx) {
  const sessionKey = ctx.cookies.get('session_user');
  return sessionKey && Utils.getSession(sessionKey)
}

