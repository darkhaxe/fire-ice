// 微信消息处理中间件
import config from '../config'
import sha1 from 'sha1'
import getRawBody from 'raw-body' // 获取http请求的消息体 库
import * as util from './util'

/**
 * 微信请求消息处理函数
 * @param opts 微信消息体
 * @param reply 回复处理类
 * @returns {wechatMiddleware}
 */
export default function (opts, reply) {
    return async function wechatMiddleware(ctx, next) {
        const token = config.core.token
        // 获取所有参数
        const {signature, nonce, timestamp, echostr} =
            ctx.query // 微信传入的变量
        console.log('ctx.query==>' + ctx.query)
        // 2.加密校验,确认参数合法
        const str = [token, timestamp, nonce].sort().join('')
        const sha = sha1(str)
        // 3.不同的HTTP请求
        if (ctx.method === 'GET') {
            if (signature === sha) {
                ctx.body = echostr
            } else {
                ctx.body = 'failed'
            }
        } else if (ctx.method === 'POST') {
            if (signature !== sha) {
                ctx.body = 'failed'
                return false
            }
            // 重点:处理微信推送过来的数据包
            const data = await getRawBody(ctx.req, {
                // 对消息体的相关限制
                length: ctx.length,
                limit: '1mb', // 限制body最大1mb
                encoding: ctx.charset
            })
            // XML->JSON 自己的工具类对数据进行解析
            const content = await util.parseXML(data)
            ctx.weixin = util.formatMessage(content.xml)

            // 策略模式:执行时传入当前的上下文
            // 调用reply方法,传入ctx,next
            await reply.apply(ctx, [ctx, next])
            // 回复微信服务器的数据 replyBody与msg
            const replyBody = ctx.body
            const msg = ctx.weixin
            // JSON->XML
            const xml = util.tpl(replyBody, msg)
            // 处理完毕,封装到ctx,返回微信
            ctx.status = 200
            ctx.type = 'application/xml'
            ctx.body = xml
        }
    }
}
