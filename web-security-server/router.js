const Router = require('@koa/router');
const controllers = require('./controllers');

const router = new Router();

router.prefix('/api')
router.get('/index', controllers.index);
router.get('/post/:id', controllers.post);
router.post('/post/addComment', controllers.addComment);
router.post('/doLogin', controllers.doLogin)
router.post('/doRegister', controllers.doRegister)
router.get('/getLoginInfo', controllers.getLoginInfo)
router.get('/getCaptcha', controllers.getCaptcha)



// router.all('/*', async function(ctx, next){
//   console.log('进入 站点 ');
//   await next();
// });

// router.get('/', );
// router.get('/post/:id', controllers.post);


module.exports = router;
