const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const koaBody = require('koa-body');

const app = new Koa();
const router = new Router();

// POST /signup
// POST /sigin
// GET /messages
// POST /messages { text: sdafads, author: 12345 }
// GET /users
// WSS /chat


router.post('/users/login', koaBody(), async ctx => {
    let body = ctx.request.body;
    let isError = false;
    let result = {};

    if (!body.login) {
        result.login = 'required';
        isError = true;
    }

    if (!body.password) {
        result.password = 'required';
        isError = true;
    }

    if (isError) {
        ctx.status = 400;
        ctx.body = result;
        return;
    }

    ctx.body = {status: 'ok', body: ctx.request.body};
});

router.get('/users', (ctx, next) => {
    ctx.body = JSON.stringify([{name: 'ilia'}]);
});

app
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(async ctx => {
        ctx.body = 'Use api methods please';
    });

console.log('started at', process.env);
app.listen(process.env.PORT || 3000);