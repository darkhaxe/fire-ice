import {getWechat, getOAuth} from '../wechat'

const wechatApi = getWechat()
const oauth = getOAuth()

export async function getSignatureAsync(url) {
    // 获取access_token
    const data = await wechatApi.fetchAccessToken()
    const token = data.access_token
    // 获取ticket
    const ticketData = await wechatApi.fetchTicket(token)
    const ticket = ticketData.ticket
    // 加密
    let params = wechatApi.sign(ticket, url)
    params.appId = wechatApi.appID

    return params
}

export function getAuthorizeURL(...args) {
    return oauth.getAuthorizeURL(...args)
}

export async function getUserByCode(code) {
    const data = await oauth.fetchAccessToken(code)
    const openid = data.openid
    return await oauth.getUserInfo(data.access_token, openid)
}
