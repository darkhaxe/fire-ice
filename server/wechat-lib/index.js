//access_token 统一管理模块
//统一获取和刷新Access_token，其他业务逻辑服务器所使用的access_token均来自于该中控服务器，
// 不应该各自去刷新，否则容易造成冲突，导致access_token覆盖而影响业务；
import request from 'request-promise'

const base_url = 'https://api.weixin.qq.com/cgi-bin'
const api = {
    accessToken: base_url + '/token?grant_type=client_credential&appid=APPID&secret=APPSECRET'
}

class Wechat {
    constructor(opts) {
        this.opts = Object.assign({}, opts)
        this.appID = opts.appID
        this.appSecret = opts.appSecret
        this.getAccessToken = opts.getAccessToken
        this.saveAccessToken = opts.saveAccessToken
        this.fetchAcessToken()
    }

    async request(opts) {
        opts = Object.assign({}, opts, {json: true})
        try {
            const resp = await request(opts)
            console.log('------>' + resp)
            return resp
        } catch (e) {
            console.error(e)
        }
    }

    async fetchAcessToken() {
        if (this._isValid(data)) {
            return await this.updateAccessToken()
        }

    }


    async updateAccessToken() {
        const url = api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret
        const data = await this.request({url: url})
        //20s缓冲时间
        const expiresIn = new Date().getTime() + (data.expires_in - 20) * 1000
        data.expires_in = expiresIn
        return data
    }


    /**
     * 判断token是否有效
     * @param data
     */
    static _isValid(data) {
        if (!data || !data.access_token || !data.expires_in) {
            return false
        }
        return data.expires_in > new Date().getTime()
    }


}