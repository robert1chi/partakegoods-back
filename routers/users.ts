/**
 * userrouters
 */
import Router from "@koa/router";
import koaBody from "koa-body";
import Token from "@/server/authentication/token";
import Users from "@/middlewares/users";
import { global } from "@/server/global/config";

const router = new Router();

const routers = router.post("/login", koaBody(), new Token().authUser, async (ctx) => {
    if (ctx.auth.accepted) {
        ctx.cookies.set('HAS_LOGIN', "true", { domain: global.host, path: '/', httpOnly: false, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: 'lax' });
        ctx.cookies.set("SESSIONID", ctx.auth.token, { domain: global.host, path: '/', httpOnly: true, sameSite: 'strict' });
        ctx.cookies.set("USERID", String(ctx.auth.userId), { domain: global.host, path: '/', httpOnly: false, sameSite: 'strict' })
        ctx.body = {
            code: 0,
            data: {
                username: ctx.auth.username,
                role: ctx.auth.role,
                id: ctx.auth.userId
            }
        }
    } else {
        ctx.body = {
            code: 403,
            data: {},
            msg: ctx.auth.msg,
        }
    }
})
router.post("/logout", koaBody(), new Users().userLogout, async (ctx) => {
    ctx.body = {
        code: 0,
        data: {},
        msg: "logout success"
    }
})
router.post("/offline", koaBody(), new Users().userOffline, async (ctx) => {
    ctx.body = {
        code: 0,
        data: {},
        msg: "offline success"
    }
})
router.get("/detail", koaBody(), new Users().userDetail, async (ctx) => {

})
const users = routers

export default users;