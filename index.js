const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

// POST /signup
// POST /sigin
// GET /messages
// GET /users
// WSS /chat


router.get('/users', (ctx, next) => {
    ctx.body = JSON.stringify([{name: 'ilia'}]);
});


app
    .use(router.routes())
    .use(router.allowedMethods())
    .use(async ctx => {
        ctx.body = 'Use api methods please';
    });

console.log('started at', process.env);
app.listen(process.env.PORT || 3000);