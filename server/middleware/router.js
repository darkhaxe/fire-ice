// import Router from 'koa-router'
// import config from '../config'
// import reply from '../wechat/reply'
// import wechatMiddleware from '../wechat-lib/wechatMiddleware'
// import {signature, redirect, oauth,} from "../controllers/wechatController"
// -----------------------------改造前----------------------------------------
import {resolve} from 'path'
import {Route} from '../decorator/router' // 自己封装的Router中间件

// server/index.js 中调用此中间件
/**
 *
 * @param app 即koa
 */
export const router = app => {
    let controllerPath = resolve(__dirname, '../routes') //加载routes文件夹下所有controller
    // console.log(`/server/middleware/router.js-->controllerPath=${controllerPath}`)
    new Route(app, controllerPath).init() // 构造路由并启动

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
