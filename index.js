const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

// POST /signup
// POST /sigin
// GET /messages
// POST /messages { text: sdafads, author: 12345 }
// GET /users
// WSS /chat


router.post('/users/login', async ctx => {
    console.log(ctx.request.body);
    ctx.body = {status: 'ok'};
});

router.get('/users', (ctx, next) => {
    ctx.body = JSON.stringify([{name: 'ilia'}]);
});

app
    .use(bodyParser())
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(async ctx => {
        ctx.body = 'Use api methods please';
    });

console.log('started at', process.env);
app.listen(process.env.PORT || 3000);