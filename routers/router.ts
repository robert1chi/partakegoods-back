import Router from '@koa/router';
import users from './users'
import admin from './admin'
import setting from './setting'
import home from './home'
import goods from './goods'

const apiRouter: Router = new Router();

// apiRouter.use('/',web.routes(),web.allowedMethods())
apiRouter.use('/api/home', home.routes(), home.allowedMethods())
apiRouter.use('/api/users', users.routes(), users.allowedMethods())
apiRouter.use('/api/admin', admin.routes(), admin.allowedMethods())
apiRouter.use('/api/setting', setting.routes(), setting.allowedMethods())
apiRouter.use('/api/goods', goods.routes(), goods.allowedMethods())

export default apiRouter;