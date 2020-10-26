const Router = require('@koa/router');
const controllers = require('./controllers');

const router = new Router();

router.prefix('/api')
router.get('/index', controllers.index);
router.get('/post', controllers.post);



// router.all('/*', async function(ctx, next){
//   console.log('进入 站点 ');
//   await next();
// });

// router.get('/', );
// router.get('/post/:id', controllers.post);


module.exports = router;
