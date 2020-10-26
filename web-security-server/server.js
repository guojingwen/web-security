const Koa = require('koa');
const app = new Koa();

// const bodyParser = require('koa-bodyparser'); // 使用 async await
// app.use(bodyParser());
app.use(require('koa2-cors')())

const router = require('./router')
app.use(router.routes()).use(router.allowedMethods());

app.listen(8080, function(){
	console.log('App is listening on port 8080');
});
