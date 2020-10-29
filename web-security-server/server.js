const Koa = require('koa');
const app = new Koa();
const Utils = require('./utils')

app.use(require('koa-bodyparser')()); // 接收POST的数据
app.use(require('koa2-cors')({credentials: true}))

app.use(async function (ctx, next) {
	const sessionKey = ctx.cookies.get('session_user');
	if(sessionKey) {
		const userId = ctx.userId = Utils.getSession(sessionKey)
		if(!userId) {
			ctx.cookies.set('session_user', sessionKey, {httpOnly: false, maxAge: -1,/*, sameSite: true*/})
			ctx.body = {
				code: -2,
				message: '登录信息已经过期，请重新登录'
			}
			return false
		}
	}
	await next()
})
const router = require('./router')
app.use(router.routes()).use(router.allowedMethods());

app.listen(8080, function(){
	console.log('App is listening on port 8080');
});
