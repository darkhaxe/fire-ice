import Router from 'koa-router'
import config from '../config'
import reply from '../wechat/reply'
import wechatMiddleware from '../wechat-lib/wechatMiddleware'
import {signature} from "../controllers/wechat";

//路由中间件:处理get,post请求
export const router = app => {
    const router = new Router()
    router.all('/wechat-hear', wechatMiddleware(config.wechat, reply))

    router.get('/wechat-signature', signature)

    app.use(router.routes())
        .use(router.allowedMethods())
}