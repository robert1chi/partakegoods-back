import { handleDataSource } from "@/server/database";
import { UserTable } from "@/server/database/entities/UserTable";
import { ValidJwt } from "@/server/database/entities/ValidJwt";
import { TypeList } from "@/server/database/entities/TypeList";
import winston from "@/winstonLogger";

export default class Goods {
    static handleTypeList(groupId: number) {
        return async (ctx: any, next: any) => {
            const typeList = await handleDataSource
                .createQueryBuilder()
                .select(["type.id", "type.name"])
                .from(TypeList, "type")
                .where("type.group_id = :groupId", { groupId })
                .getMany()
            ctx.body = {
                code: 0,
                msg: 'success',
                data: typeList
            }
            await next()
        }
    }

    // get goodsList() {
    //     return async (ctx: any, next: any) => {
    //         const goodsList = await handleDataSource
    //             .createQueryBuilder()
    //             .select("goods")
    //             .from(UserTable, "goods")
    //             .getMany()
    //         ctx.body = {
    //             code: 0,
    //             msg: 'success',
    //             data: goodsList
    //         }
    //         await next()
    //     }
    // }
    // get addGoods() {
    //     return async (ctx: any, next: any) => {
    //         type IAddGoods = {
    //             name: string;
    //             price: number;
    //             stock: number;
    //         }
    //         const addBody: IAddGoods = ctx.request.body
    //         await handleDataSource
    //             .createQueryBuilder()
    //             .insert()
    //             .into(UserTable)
    //             .values({
    //                 name: addBody.name,
    //                 price: addBody.price,
    //                 stock: addBody.stock
    //             })
    //             .execute()
    //         winston.info(`Goods ${addBody.name} add success`)
    //         ctx.body = {
    //             code: 0,
    //             msg: 'Add success',
    //             data: {}
    //         }
    //         await next()
    //     }
    // }
}