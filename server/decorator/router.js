import {resolve} from 'path'
import Router from 'koa-router'
import glob from 'glob'
import _ from 'lodash'
import R from 'ramda'

// https://github.com/pleerock/routing-controllers
let reqID = 0

/*
我们首先知道，Javascript 的任何值，都不外乎是这几种类型，对象类型 Object 或者 字符串类型 String 或者
布尔类型 Boolean 或者 数字类型 Number 或者 Undefined 未定义，或者是空值 Null
而整个 Symbol 算是第七种类型吧，但是它是比较特殊一点，它也是值，但又不是数字或者字符串，
通过 Symbol 生成的值，与任何其他的值都不相等，也就是说，每一个 Symbol 都是独一无二的不会重复的，
而且创建后不能修改，这就保证了它的唯一性，也不会被污染到。
*/
const symbolPrefix = Symbol('prefix')
let routersMap = new Map()

// 判断是否数组,否则包装成数组
let toArray = arr => _.isArray(arr) ? arr : [arr]
// 路径加上/
let normalizePath = path => path.startsWith('/') ? path : `/${path}`

export class Route {
    /**
     *
     * @param app 为koa实例化的app本身
     * @param controllerPath routes文件夹地址
     */
    constructor(app, controllerPath) {
        this.app = app
        this.koa_router = new Router()
        this.controllerPath = controllerPath
    }

    init() {
        // 遍历目录下所有的路由文件
        glob.sync(resolve(this.controllerPath, './*.js')).forEach(require)
        // _.forIn(routersMap, (value, key) => {
        //     console.log(`routerMap内容:value=${value},key=${ key}`)
        // })
        for (let [target_controller_config, func] of routersMap) {
            // console.log(target_controller_config.target[symbolPrefix] +"--" + func)
            let functions = toArray(func)
            let prefix_path = target_controller_config.target[symbolPrefix]
            // if (prefixPath) prefixPath = normalizePath(prefixPath)
            let router_path = prefix_path + target_controller_config.path
            // Router['get']('/wx-hear',) koa路由进行调用
            this.koa_router[target_controller_config.method](router_path, ...functions)
        }

        this.app.use(this.koa_router.routes())
        this.app.use(this.koa_router.allowedMethods())
    }
}

/**
 * 将各个Controller的路由方法加入routersMap
 * -- @get('/xxx'),@post('/xxx')...
 * @param target_controller_config 调用参数传入值{method:'get',path:'/xxx'},然后在返回的闭包函数里,给conf加上target
 *  解析:
 *  target_controller=具体的controller类 如WxController {}
 *  target_controller[method]即 WxController中的函数wxHear(ctx, next):
 *  WxController[wxHear]=function (_x, _x2) {
 *      return _ref.apply(this, arguments);
 *      },wxHear(ctx, next) {
 *      return _asyncToGenerator(function* () {
 *          const middle = (0, _wechatMiddleware2.default)(_config2.default.core, _reply2.default);
 *          yield middle(ctx, next);
 *      })();
 *  }
 */
const doRoute = target_controller_config => (target_controller, func) => {
    // 给path加上斜杠
    target_controller_config.path = normalizePath(target_controller_config.path) //此path为controller上的path
// 设置routerMap,给传入参数conf添加一个target属性,然后整个Object作为一个key
// {k:{target:WxController,method:'get',path:'/xxx'},v:WxController[wxHear]}
    routersMap.set({target: target_controller, ...target_controller_config}, target_controller[func])
    // console.log(`-----------------------------------------------------`)
    // console.log(`执行router:key=${key} target[key]=${target[key]}`)
    // console.log(target)
    // console.log(`-----------------------------------------------------`)
}
//es5 写法 闭包
// var router = function router(conf) {
//     return function (target, key, descriptor) {
//         conf.path = normalizePath(conf.path); // 给path加上斜杠
//         routersMap.set(_extends({
//             target: target
//         }, conf), target[key]);
//     };
// };

export const controller = path => target => {
    // 保证controller唯一
    // 在使用@controller时为 目标类 添加一个field {"prefix":path}
    target.prototype[symbolPrefix] = path
}
// function controller(path) {
//     return function (target) {
//         // 保证controller唯一
//         target.prototype[symbolPrefix] = path;
//     };
// };

//router({})返回一个函数 ,@get()实施装饰器
export const get = path => doRoute({
    method: 'get',
    path: path
})

export const post = path => doRoute({
    method: 'post',
    path: path
})

export const put = path => doRoute({
    method: 'put',
    path: path
})

export const del = path => doRoute({
    method: 'del',
    path: path
})

let convert = middleware => (...args) => decorate(args, middleware)

/**
 * 日志记录 decorator
 */
export const log = convert(async (ctx, next) => {
    let currentReqID = reqID++
    console.time(`${currentReqID} ${ctx.method} ${ctx.url}`)
    await next()
    console.timeEnd(`${currentReqID} ${ctx.method} ${ctx.url}`)
})
let decorate = (args, middleware) => {
    let [target, key, descriptor] = args

    target[key] = toArray(target[key])
    target[key].unshift(middleware)

    return descriptor
}


/*
  @required({
    body: ['username', 'password'],
    query: ['token']
  })
*/

export const required = rules => convert(async (ctx, next) => {
    let errors = []
    const passRules = R.forEachObjIndexed(
        (value, key) => {
            errors = R.filter(i => !R.has(i, ctx.request[key]))(value)
        }
    )
    passRules(rules)

    if (errors.length) ctx.throw(412, `${errors.join(',')} is required`)
    await next()
})
