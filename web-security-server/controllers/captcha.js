const svgCaptcha = require('svg-captcha');
const Utils = require('../utils')

// 获取验证码
exports.getCaptcha = async function(ctx, next){
  const captcha = svgCaptcha.create({
    // 翻转颜色
    inverse: false,
    // 字体大小
    fontSize: 36,
    // 噪声线条数
    noise: 2,
    // 宽度
    width: 80,
    // 高度
    height: 30,
  });
  // 保存到session,忽略大小写
  // ctx.session = captcha.text.toLowerCase();
  const key = new Date().getTime() + parseInt(Math.random().toString() * 10000)
  Utils.setCacheByKey(key, captcha.text.toLowerCase()) // // 生成的验证码
  // 保存到cookie 方便前端调用验证
  ctx.cookies.set('captcha', key, {httpOnly: false/*, sameSite: true*/});
  ctx.type = 'image/svg+xml'
  // ctx.set('cache-control', `private, max-age=3600`);
  ctx.body = String(captcha.data)
}
