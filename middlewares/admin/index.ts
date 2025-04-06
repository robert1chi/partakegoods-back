import { handleDataSource } from "@/server/database";
import { UserTable } from "@/server/database/entities/userTable";
import { ValidJwt } from "@/server/database/entities/validJwt";
import HashCrypto from "@/server/authentication/crypto";
import winston from "@/winstonLogger";
export default class Admin {
    get forceLogout() {
        return async (ctx: any, next: any) => {
            type IForceLogout = {
                userId: number;
            }
            const forceBody: IForceLogout = ctx.request.body
            const result = await handleDataSource
                .createQueryBuilder()
                .select("user")
                .from(UserTable, "user")
                .where("user.id = :id", { id: forceBody.userId })
                .getOne()
            if (!result) {
                ctx.body = {
                    code: 0,
                    msg: 'no user'
                }
                return
            }
            await handleDataSource
                .createQueryBuilder()
                .update(ValidJwt)
                .set({ blocked: 1 })
                .where("user_id = :id", { id: forceBody.userId })
                .execute()
            winston.info(`User ${forceBody.userId} was forced logout`)
            await next()
        }
    }
    get regesterUser() {
        return async (ctx: any, next: any) => {
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
            winston.info(`User ${regesterBody.username} register success`)
            await next()
        }
    }
    get activeUser() {
        return async (ctx: any, next: any) => {
            type IActiveUser = {
                userId: number;
            }
            const activeBody: IActiveUser = ctx.request.body
            const userId = ctx.cookies.get("USERID")
            if (activeBody.userId) {
                if (activeBody.userId === userId) {
                    ctx.body = {
                        code: 0,
                        msg: 'can not active yourself'
                    }
                    return
                }
                winston.info(`User ${userId} is trying to active ${activeBody.userId}`)
                const result = await handleDataSource
                    .createQueryBuilder()
                    .select("user")
                    .from(UserTable, "user")
                    .where("user.id = :id", { id: activeBody.userId })
                    .getOne()
                if (!result) {
                    ctx.body = {
                        code: 0,
                        msg: 'no user'
                    }
                    return
                }
                await handleDataSource
                    .createQueryBuilder()
                    .update(UserTable)
                    .set({ available: 1 })
                    .where("id = :id", { id: activeBody.userId })
                    .execute()
                winston.info(`User ${result.username} active success`)
                await next()
            } else {
                ctx.body = {
                    code: 0,
                    msg: 'no userId'
                }
                return
            }
        }
    }
    get disableUser() {
        return async (ctx: any, next: any) => {
            type IDisableUser = {
                userId: number;
            }
            const disableBody: IDisableUser = ctx.request.body
            const userId = ctx.cookies.get("USERID")

            if (disableBody.userId) {
                if (disableBody.userId === userId) {
                    ctx.body = {
                        code: 0,
                        msg: 'can not disable yourself'
                    }
                    return
                }
                winston.info(`User ${userId} is trying to disable ${disableBody.userId}`)
                const result = await handleDataSource
                    .createQueryBuilder()
                    .select("user")
                    .from(UserTable, "user")
                    .where("user.id = :id", { id: disableBody.userId })
                    .getOne()
                if (!result) {
                    ctx.body = {
                        code: 0,
                        msg: 'no user'
                    }
                    return
                }
                await handleDataSource
                    .createQueryBuilder()
                    .update(UserTable)
                    .set({ available: 0 })
                    .where("id = :id", { id: disableBody.userId })
                    .execute()
                winston.info(`User ${result.username} disable success`)
                await next()
            } else {
                ctx.body = {
                    code: 0,
                    msg: 'no userId'
                }
                return
            }
        }
    }
}