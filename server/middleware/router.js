// import Router from 'koa-router'
// import config from '../config'
// import reply from '../wechat/reply'
// import wechatMiddleware from '../wechat-lib/wechatMiddleware'
// import {signature, redirect, oauth,} from "../controllers/wechatController"
// -----------------------------改造前----------------------------------------
import {resolve} from 'path'
import {Route} from '../decorator/router' // 自己封装的Router中间件

const r = path => resolve(__dirname, path)
// server/index.js 引入此router
/**
 *
 * @param app 即koa
 */
export const router = app => {
    const apiPath = r('../routes')
    console.log(`apiPath=${apiPath}`)
    new Route(app, apiPath).init() // 构造路由并启动

    // -----------------------------改造前----------------------------------------
// 路由中间件:处理get,post请求
    // router.all('/wechat-hear', wechatMiddleware(config.core, reply))
    // //交由controller层处理业务逻辑
    // router.get('/wechat-signature', signature)
    // router.get('/wechat-redirect', redirect)
    // router.get('/wechat-oauth', oauth)
    //
    // app.use(router.routes())
    //     .use(router.allowedMethods())
    // -----------------------------改造前----------------------------------------
}
