import Router from 'koa-router'
import config from '../config'
import reply from '../wechat/reply'
import wechatMiddleware from '../wechat-lib/wechatMiddleware'

//路由中间件:处理get,post请求
export const router = app => {
    const router = new Router()
    router.all('/wechat-hear', wechatMiddleware(config.wechat, reply))

    app.use(router.routes())
        .use(router.allowedMethods())
}