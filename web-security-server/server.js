const Koa = require('koa');
const app = new Koa();
const Utils = require('./utils')
const cookieOptions = (process.env.NODE_ENV === 'production') ? {httpOnly: true, sameSite: true} : {httpOnly: false, sameSite: false}

app.use(require('koa-bodyparser')()); // 接收POST的数据
app.use(require('koa2-cors')({credentials: true}))

app.use(async function (ctx, next) {
	const sessionKey = ctx.cookies.get('session_user');
	if(sessionKey) {
		const userId = ctx.userId = Utils.getSession(sessionKey)
		if(!userId) {
			ctx.cookies.set('session_user', sessionKey, Object.assign({maxAge: -1}, cookieOptions))
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

app.listen(10013, function(){
	console.log('App is listening on port 10013');
});
