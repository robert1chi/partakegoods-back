/**
 * @description admin routers
 */
import Router from "@koa/router";
import Admin from "@/middlewares/admin";
import Token from "@/server/authentication/token";
import HashCrypto from "@/server/authentication/crypto";
import { handleDataSource } from "@/server/database";
import { UserTable } from "@/server/database/entities/UserTable";
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
        msg: 'admin.forceLogout'
    }
})
router.post('/registerUser', koaBody(), new Token(1).authLevel, new Admin().regesterUser, async (ctx) => {
    ctx.body = {
        code: 0,
        msg: 'admin.regesterUser',
        data: {}
    }
})
router.post('/activeUser', koaBody(), new Token(1).authLevel, new Admin().activeUser, async (ctx) => {
    ctx.body = {
        code: 0,
        msg: 'admin.activeUser',
        data: {}
    }
})
router.post('/disableUser', koaBody(), new Token(1).authLevel, new Admin().disableUser, async (ctx) => {
    ctx.body = {
        code: 0,
        msg: 'admin.disableUser',
        data: {}
    }
})
const admin = routers

export default admin;