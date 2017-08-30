import mongoose from 'mongoose'
import config from '../config'
import WeChatApi from '../wechat-lib'

const Token = mongoose.model('Token')

//Token如何关联到getAccessToken() 见/wechat-lib/index.js
const wechatConfig = {
    appID: config.wechat.appID,
    appSecret: config.wechat.appSecret,
    token: config.wechat.token,
    getAccessToken: async () => await Token.getAccessToken(),
    saveAccessToken: async (data) => await Token.saveAccessToken(data),
}

export const getWechat = () => {
    return new WeChatApi(wechatConfig)
}

//debug...
getWechat()