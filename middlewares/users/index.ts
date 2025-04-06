import { handleDataSource } from "@/server/database";
import { UserTable } from "@/server/database/entities/userTable";
import { ValidJwt } from "@/server/database/entities/validJwt";
import winston from "@/winstonLogger";
import { global } from "@/server/global/config";
import HashCrypto from "@/server/authentication/crypto";

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
    get changePassword() {
        return async (ctx: any, next: any) => {
            type IChangePassword = {
                oldPassword: string;
                newPassword: string;
            }
            const changePasswordBody: IChangePassword = ctx.request.body
            const userId = ctx.cookies.get("USERID")

            const userSalt = await handleDataSource
                .createQueryBuilder()
                .select("user.salt")
                .from(UserTable, "user")
                .where("user.id = :id", { id: userId })
                .getOne()
            if (!userSalt) {
                ctx.body = {
                    code: 0,
                    msg: 'User not found',
                    data: {}
                }
                await next()
                return
            }
            const hashedOldPassword = HashCrypto.hashedPassword(changePasswordBody.oldPassword, userSalt.salt);
            const userDetail = await handleDataSource
                .createQueryBuilder()
                .select(["user.id"])
                .from(UserTable, "user")
                .where("user.id = :id", { id: userId })
                .andWhere("user.passwd = :passwd", { passwd: hashedOldPassword })
                .getOne()
            if (!userDetail) {
                ctx.body = {
                    code: 0,
                    msg: 'Old password is wrong',
                    data: {}
                }
            } else {
                const { salt, hashedPassword } = HashCrypto.hashPassword(changePasswordBody.newPassword)
                await handleDataSource
                    .createQueryBuilder()
                    .update(UserTable)
                    .set({
                        passwd: hashedPassword,
                        salt: salt
                    })
                    .where("id = :id", { id: userId })
                    .execute()
                ctx.body = {
                    code: 0,
                    msg: 'Change password success',
                    data: {}
                }
            }
            await next()
        }
    }
}