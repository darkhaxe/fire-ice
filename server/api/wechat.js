import {getWechat, getOAuth} from '../wechat'

const wechatApi = getWechat()


export async function getSignatureAsync(url) {
    //获取ticket
    const data = await wechatApi.fetchAccessToken()
    const token = data.access_token
    const ticketData = await wechatApi.fetchTicket(token)
    const ticket = ticketData.ticket
    //加密
    let params = wechatApi.sign(ticket, url)
    params.appId = wechatApi.appID

    return params
}

export function getAuthorizeURL(...args) {
    return getOAuth().getAuthorizeURL(...args)
}

export async function getUserByCode(code) {
    const oauth = getOAuth()

    const data = await oauth.fetchAccessToken(code)
    const openid = data.openid
    return await oauth.getUserInfo(data.access_token, openid)
}