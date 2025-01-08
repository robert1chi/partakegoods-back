import { handleDataSource } from "@/server/database";
import { UserTable } from "@/server/database/entities/userTable";
import { ValidJwt } from "@/server/database/entities/validJwt";
import winston from "@/winstonLogger";
import { global } from "@/server/global/config";

export default class Users {
    get userLogout() {
        return async (ctx: any, next: any) => {
            const token = ctx.cookies.get("SESSIONID");
            await handleDataSource.createQueryBuilder()
                .delete()
                .from(ValidJwt)
                .where("jwt = :jwt", { jwt: token })
                .execute();
            winston.info(`User ID ${ctx.cookies.get("USERID")} logout`)
            ctx.cookies.set('HAS_LOGIN', "false", { domain: global.host, path: '/', httpOnly: false, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: 'lax' });
            ctx.cookies.set("SESSIONID", "", { domain: global.host, path: '/', httpOnly: true, sameSite: 'strict', maxAge: 0 });
            await next()
        }
    }
    get userOffline() {
        return async (ctx: any, next: any) => {
            const userId = ctx.cookies.get("USERID");
            await handleDataSource.createQueryBuilder()
                .delete()
                .from(ValidJwt)
                .where("user_id = :id", { id: userId })
                .execute();
            winston.info(`User ID ${ctx.cookies.get("USERID")} offline`)
            ctx.cookies.set('HAS_LOGIN', "false", { domain: global.host, path: '/', httpOnly: false, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: 'lax' });
            ctx.cookies.set("SESSIONID", "", { domain: global.host, path: '/', httpOnly: true, sameSite: 'strict', maxAge: 0 });
            await next()
        }
    }
    get userDetail() {
        return async (ctx: any, next: any) => {
            const userId = ctx.cookies.get("USERID");
            const userDetail = await handleDataSource.getRepository(UserTable)
                .createQueryBuilder('user')
                .select(["user.id", "user.username", "user.role"])
                .where("user.id = :id", { id: userId })
                .cache(30000)
                .getOne();
            ctx.body = {
                code: 0,
                data: {
                    ...userDetail
                }
            }
            await next()
        }
    }
}