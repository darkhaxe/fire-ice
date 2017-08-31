import {getWechat} from '../wechat'

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