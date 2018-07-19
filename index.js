const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const koaBody = require('koa-body');
const Db = require('tingodb')().Db;
const promisify = require('@octetstream/promisify');

const app = new Koa();
const router = new Router();

// POST /signup
// POST /sigin
// GET /messages
// POST /messages { text: sdafads, author: 12345 }
// GET /users
// WSS /chat

let cache = {};
const db = new Db(__dirname, {});
const users = db.collection("users");

router.post('/users/signup', koaBody(), async ctx => {
    let body = JSON.parse(ctx.request.body || '{}' );
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

    if (!body.passwordRepeat) {
        result.passwordRepeat = 'required';
        isError = true;
    }

    if (body.passwordRepeat !== body.password) {
        result.passwordRepeat = 'not-equal';
        isError = true;
    }

    let exist = await promisify(users.findOne({login: body.login}));

    console.log(exist)

    if (exist) {
        result.password = 'used';
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