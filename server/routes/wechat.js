import {controller, get, post, log} from '../decorator/router'
import * as wechat from '../controllers/wechatController.js'
import config from '../config'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/wechatMiddleware.js'

// Decorator改造后的微信路由请求处理类
@controller('')
export class WxController {
    @get('/wechat-hear')
    @log
    async wxHear(ctx, next) {
        const middle = wechatMiddle(config.core, reply)
        await middle(ctx, next)
    }

    @get('/wechat-signature')
    async wxSignature(ctx, next) {
        await wechat.signature(ctx, next)
    }

    @get('/wechat-redirect')
    async wxRedirect(ctx, next) {
        console.log('into redirect')
        await wechat.redirect(ctx, next)
    }

    @get('/wechat-oauth')
    async wxOAuth(ctx, next) {
        await wechat.oauth(ctx, next)
    }
}
