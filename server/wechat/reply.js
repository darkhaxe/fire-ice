// 回复策略:处理粉丝发送的不同的消息类型
// 类型:文字/图片/语音/地理位置/事件(关注取关/上报地理位置/..)

const tip = '1万两千年的友情!click--><a href="http://www.baidu.com">Gunbuster</a>'
/**
 *
 * @param ctx 所在上下文
 * @param next
 * @returns {Promise.<void>}
 */
export default async (ctx, next) => {
    const msg = ctx.weixin
    // console.log('reply.js -->' + msg)
    let client = require('../wechat').getWechat()
    if (msg.MsgType === 'event') {  // 事件
        if (msg.Event === 'subscribe') {
            ctx.body = tip
        } else if (msg.Event === 'unsubscribe') {
            console.log('取关了')
        }
    } else if (msg.MsgType === 'text') {
        if (msg.Content === '1') { // 调试
            console.log(await client.handle('fetchUserList'))
        } else if (msg.Content === '2') { // 调试 删除菜单再重建
            const menu = require('./menu').default
            await client.handle('delMenu')
            console.log(await client.handle('createMenu', menu))
        }
    }

    ctx.body = tip
}
