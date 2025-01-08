import Router from '@koa/router';
import users from './users'
import admin from './admin'
import setting from './setting'
import home from './home'

const apiRouter: Router = new Router();

// apiRouter.use('/',web.routes(),web.allowedMethods())
apiRouter.use('/api/home', home.routes(), home.allowedMethods())
apiRouter.use('/api/users', users.routes(), users.allowedMethods())
apiRouter.use('/api/admin', admin.routes(), admin.allowedMethods())
apiRouter.use('/api/setting', setting.routes(), setting.allowedMethods())

export default apiRouter;