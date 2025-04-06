import { handleDataSource } from "@/server/database";
import { UserTable } from "@/server/database/entities/userTable";
import { ValidJwt } from "@/server/database/entities/validJwt";

export default class Admin {
    get forceLogout() {
        return async (ctx: any, next: any) => {
            type IForceLogout = {
                userId: number;
            }
            const forceBody: IForceLogout = ctx.request.body
            await handleDataSource
                .createQueryBuilder()
                .update(ValidJwt)
                .set({ blocked: 1 })
                .where("user_id = :id", { id: forceBody.userId })
                .execute()
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
            const user = await handleDataSource
                .createQueryBuilder()
                .insert()
                .into(UserTable)
                .values({
                    username: regesterBody.username,
                    passwd: regesterBody.password,
                    role: regesterBody.role
                })
                .execute()
            ctx.body = {
                code: 0,
                msg: 'Register success',
                data: {}
            }
            await next()
        }
    }
}