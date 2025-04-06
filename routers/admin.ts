/**
 * admin routers
 */
import Router from "@koa/router";
import Admin from "@/middlewares/admin";
import Token from "@/server/authentication/token";
import HashCrypto from "@/server/authentication/crypto";
import { handleDataSource } from "@/server/database";
import { UserTable } from "@/server/database/entities/userTable";
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
router.post('/regesterUser', koaBody() , async (ctx) => {
    type IRegesterUser = {
        username: string;
        password: string;
        role: number;
    }
    const regesterBody: IRegesterUser = ctx.request.body
    const { salt, hashedPassword } = HashCrypto.hashPassword(regesterBody.password)
    await handleDataSource
        .createQueryBuilder()
        .insert()
        .into(UserTable)
        .values({
            username: regesterBody.username,
            passwd: hashedPassword,
            salt: salt,
            role: regesterBody.role
        })
        .execute()
    ctx.body = {
        code: 0,
        msg: 'Register success',
        data: {}
    }
})
const admin = routers

export default admin;