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
}