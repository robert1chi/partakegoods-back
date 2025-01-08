import Router from "@koa/router";

const router = new Router();

const routers = router.get("/", async (ctx) => {
    ctx.body = {
        msg: 'Hello World'
    }
});
router.post('/', async (ctx) => {
    ctx.body = {
        code: 0,
        data: {
            dashboard:{
                status:0,
                containerList:[{
                    id:0,
                    name:'container1',
                    status:0,
                }]
            }
        },
        msg: 'Connect success'
    }
})

const home = routers

export default home;