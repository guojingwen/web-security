const Koa = require('koa');
const app = new Koa();

app.use(require('koa-bodyparser')()); // 接收POST的数据
app.use(require('koa2-cors')({credentials: true}))


const router = require('./router')
app.use(router.routes()).use(router.allowedMethods());

app.listen(8080, function(){
	console.log('App is listening on port 8080');
});
