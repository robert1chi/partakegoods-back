/**
 * admin routers
 */
import Router from "@koa/router";
import Admin from "@/middlewares/admin";
import Token from "@/server/authentication/token";
import koaBody from "koa-body";

const router = new Router();
const routers = router.all("/", async (ctx) => {
    ctx.body = {
        msg: 'Protocol error'
    }
})
router.post('/forceLogout', koaBody(), new Token(1).authLevel, new Admin().forceLogout, async (ctx) => {
    ctx.body = {
        code: 0,
        data: {},
        msg: 'Force logout success'
    }
})
const admin = routers

export default admin;