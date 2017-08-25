import mongoose from 'mongoose'
import config from '../config'
import Wechat from '../wechat-lib'

const Token = mongoose.model('Token')

//Token如何关联到getAccessToken() 见/wechat-lib/index.js
const wechatConfig = {
    wechat: {
        appID: config.wechat.appID,
        appSecret: config.wechat.appSecret,
        token: config.wechat.token,
        getAccessToken: async () => await Token.getAccessToken(),
        saveAccessToken: async (data) => await Token.saveAccessToken(data),
    }
}

export const getWechat = () => {
    return new Wechat(wechatConfig.wechat)
}

//debug...
getWechat()