import Koa from 'koa'
import apiRouter from './routers/router'
import cors from '@koa/cors'
import Token, { authToken } from './server/authentication/token'
import winston from 'winstonLogger'
import { handleDataSource } from './server/database'
import { global } from './server/global/config'
import { ValidJwt } from './server/database/entities/ValidJwt'

const app = new Koa()

const alwaysAllowedUrl = ['/api/users/login', '/api/users/register'];

handleDataSource.initialize()
    .then(() => {
        winston.info("DataBase: All connection is established")
    })
    .catch((err) => {
        winston.error(`One of the connection is failed: ${err}`)
        throw err
    });
const { host, port } = global
console.log(host, port)
app.use(cors({
    origin: (ctx) => {
        const whiteList = ['http://192.168.1.173:3002', 'http://localhost:3002'];
        let url = ctx.header.referer.slice(0, ctx.header.referer.length - 1);
        if (whiteList.includes(url)) {
            return url
        }
        return `http://${host}:${port}`
    },
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}))
app.use(async (ctx, next) => {
    const token = ctx.cookies.get('SESSIONID') ?? ''
    const id = String(ctx.cookies.get('USERID') ?? '0')
    const auth = alwaysAllowedUrl.includes(ctx.path) ? true : (await authToken(token, id))
    if (auth === true) {
        try {
            await next()
            if (!ctx.body) {
                ctx.body = "not found"
                ctx.status = 404
            }
        } catch (e) {
            ctx.body = "server error"
            ctx.status = 500
        }
    } else {
        ctx.body = {
            code: auth.code,
            msg: auth.msg,
            data: {}
        }
        ctx.cookies.set('HAS_LOGIN', "false", { domain: global.host, path: '/', httpOnly: false, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: 'lax' });
        ctx.cookies.set("USERID", "0", { domain: global.host, path: '/', httpOnly: false, sameSite: 'strict', maxAge: 0 });
        ctx.cookies.set("SESSIONID", "", { domain: global.host, path: '/', httpOnly: true, sameSite: 'strict', maxAge: 0 });
    }
})
app.use(apiRouter.routes())
app.use(apiRouter.allowedMethods())
app.listen(port)
winston.info(`Servics is running on "http://${host}:${port}"`)