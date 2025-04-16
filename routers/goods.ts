/**
 * @description goods routers
 */

import Token from "@/server/authentication/token";
import Router from "@koa/router";

import koaBody from "koa-body";

const router = new Router();
const routers = router.all("/", async (ctx) => {
    ctx.body = {
        msg: 'Protocol error'
    }
})

router.post('/getList', koaBody(), async (ctx) => {
    ctx.body = {
        code: 0,
        msg: 'success',
        data: {
            list: [
                {
                    id: 1,
                    name: 'Apple',
                    price: 1.2,
                    stock: 100,
                    type: 'fruit'
                },]
        }
    }
})
router.post('/addList', koaBody(), async (ctx) => {
    ctx.body = {
        code: 0,
        msg: 'Add success',
        data: {}
    }
})
const goods = routers

export default goods;