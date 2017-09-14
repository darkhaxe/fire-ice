import * as api from '../api'
import config from '../config'
import {parse as urlParse} from 'url'
import {parse as queryParse} from 'querystring'

export async function signature(ctx, next) {
    let url = ctx.query.url

    if (!url) ctx.throw(404)

    url = decodeURIComponent(url)
    let params = await api.getSignatureAsync(url)

    ctx.body = {
        success: 1,
        params: params
    }
}

// 网页上点某按钮，直接跳转到 http://x.o/wechat-redirect?visit=a&id=b
// 用户被重定向到 Wechat Redirect URL 授权验证
// 验证后，自动二跳进入 http://x.o/oauth?code=xxxxxx&state=a_b
export async function redirect(ctx, next) {
    let redirect = config.SITE_ROOT_URL + '/oauth'
    let scope = 'snsapi_userinfo'
    let {visit, id} = ctx.query
    let params = id ? `${visit}_${id}` : visit

    let url = api.getAuthorizeURL(scope, redirect, params)

    ctx.redirect(url)
}

export async function oauth(ctx, next) {
    // 客户端传过来的url
    let urlObj = urlParse(decodeURIComponent(ctx.query.url))
    let user = await api.getUserByCode(queryParse(urlObj.query).code)

    console.log(user)
    ctx.session = {
        openid: user.openid
    }
    ctx.body = {
        success: true,
        user: user
    }
}
