import mongoose from 'mongoose'
import config from '../config'
import Wechat from '../wechat-lib'

const Token = mongoose.model('Token')
export const getWechat = () => {
    return new Wechat(wechatConfig.wechat)
}

const wechatConfig = {
    wechat: {
        appID: config.wechat.appID,
        appSecret: config.wechat.appSecret,
        token: config.wechat.token,
        getAccessToken: async () => Token.getAccessToken(),
        saveAccessToken: async (data) => Token.saveAccessToken(data),
    }
}
//debug...
getWechat()