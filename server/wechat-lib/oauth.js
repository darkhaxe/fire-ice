import request from 'request-promise'

const base = 'https://api.weixin.qq.com/cgi-bin'
const api = {
    authorize: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
    accessToken: base + 'oauth2/access_token?',
    userInfo: base + 'userinfo?'
}

export default class WechatOAuth {
    constructor(opts) {
        this.appID = opts.appID
        this.appSecret = opts.appSecret
    }

    /**
     *统一请求wechat
     */
    async requestWeChat(opts) {
        opts = Object.assign({}, opts, {json: true})
        try {
            return await request(opts)
        } catch (e) {
            console.error(e)
        }
    }

    /**
     *
     * @param scope 两种类型,snsapi_base:只能拿到openId;snsapi_userinfo 可拿到用户信息
     * @param target 跳转地址
     * @param state 个性化参数
     * @returns {string}
     */
    getAuthorizeURL(scope = 'snsapi_base', target, state) {
        const url = `${api.authorize}appid=${this.appID}&redirect_uri=${encodeURIComponent(target)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`

        return url
    }

    async fetchAccessToken() {
        let url = `${api.accessToken}appid=${this.appID}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`
        return await this.request({url: url})
    }


    async getUserInfo(token, openId, lang = 'zh_CN') {
        const url = `${api.user.info}access_token=${token}&openid=${openId}&lang=${lang}`
        return await this.requestWeChat(url)
    }

}