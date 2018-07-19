const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const koaBody = require('koa-body');
const Db = require('tingodb')().Db;
const uuid62 = require('uuid62');

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

function findUser(login) {

    return new Promise((resolve, reject) => {

        users.findOne({ login }, (err, user) => {

            if (err) {
                reject(err);
            } else {
                resolve(user)
            }


        });
    })

}

function addUser(user) {

    return new Promise((resolve, reject) => {

        users.insert(user, (err, result) => {

            if (err) {
                reject(err);
            } else {
                resolve(result[0])
            }


        });
    })

}

function getAllUsers() {
    return new Promise((resolve, reject) => {

        users.find({}, (err, user) => {

            if (err) {
                reject(err);
            } else {
                resolve(user)
            }

        });
    });
}

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

    let exist = await findUser(body.login);

    if (exist) {
        result.password = 'used';
        isError = true;
    }

    if (isError) {
        ctx.status = 400;
        ctx.body = result;
        return;
    }

    result = await addUser({
        login: body.login,
        password: body.password
    });

    let uid = uuid62.v4();

    cache[uid] = true;
    ctx.body = {status: 'ok', userId: result._id, auth: uid};
});

router.get('/users', async ctx => {
    if (cache[ctx.request.headers.authorization]) {
        let users = await getAllUsers();

        ctx.body = users.map(user => {
            console.log(user);
            return {
                login: user.login
            };
        });
    } else {
        ctx.status = 403;
        ctx.body = '';
    }
});

app
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(async ctx => {
        ctx.body = 'Use api methods please';
    });

app.listen(process.env.PORT || 3000);