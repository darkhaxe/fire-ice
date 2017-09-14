import mongoose from 'mongoose'
import config from '../config'
import WechatApi from '../wechat-lib'
import WechatOAuth from '../wechat-lib/oauth'

// mongoose模型
const Token = mongoose.model('Token')
const Ticket = mongoose.model('Ticket')

// Token如何关联到getAccessToken() 见/core-lib/index.js
const wechatConfig = {
    appID: config.core.appID,
    appSecret: config.core.appSecret,
    token: config.core.token,
    getAccessToken: async () => await Token.getAccessToken(),
    saveAccessToken: async (data) => await Token.saveAccessToken(data),
    getTicket: async () => await Ticket.getTicket(),
    saveTicket: async (data) => await Ticket.saveTicket(data)
}

export const getWechat = () => {
    return new WechatApi(wechatConfig)
}

export const getOAuth = () => {
    return new WechatOAuth(wechatConfig)
}
