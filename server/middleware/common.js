import koaBody from 'koa-bodyparser'
import session from 'koa-session'
//7-5节:koaBody用于aplication/json参数解析
export const addBody = app => {
    app.use(koaBody())
}

export const addSession = app => {
    app.keys = ['got']

    const CONFIG = {
        key: 'koa:sess',
        maxAge: 86400000,
        overwrite: true,
        signed: true,
        rolling: false,
    }

    app.use(session(CONFIG, app))
}
