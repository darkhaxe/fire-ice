import template from './tpl'
import xml2js from 'xml2js'
import sha1 from 'sha1'

/**
 * xml -> js
 * @param xml
 * @returns {Promise}
 */
function parseXML(xml) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, {trim: true}, (err, content) => {
            if (err) reject(err)
            else resolve(content)
        })
    })
}

/**
 * 排序
 * @param args
 * @returns {string}
 */
function sortStr(args) {
    let keys = Object.keys(args)
    let newArgs = {}
    let str = ''

    keys = keys.sort()
    keys.forEach((key) => {
        newArgs[key.toLowerCase()] = args[key]
    })

    for (let k in newArgs) {
        str += '&' + k + '=' + newArgs[k]
    }

    return str.substr(1)
}

/**
 * 生成随机字符串
 * @returns {string}
 */
function _createNonce() {
    return Math.random().toString(36).substr(2, 15)
}

function _createTimestamp() {
    return parseInt(new Date().getTime() / 1000, 0) + ''
}

function sign(ticket, url) {
    const nonce = _createNonce()
    const timestamp = _createTimestamp()
    const signature = _signIt(nonce, ticket, timestamp, url)

    return {
        noncestr: nonce,
        timestamp: timestamp,
        signature: signature
    }
}

/**
 * sha1加密
 * @param nonce
 * @param ticket
 * @param timestamp
 * @param url
 * @returns {*}
 */
function _signIt(nonce, ticket, timestamp, url) {
    const ret = { // 字典排序
        jsapi_ticket: ticket,
        nonceStr: nonce,
        timestamp: timestamp,
        url: url
    }

    return sha1(sortStr(ret))
}

function formatMessage(result) {
    let message = {}

    if (typeof result === 'object') {
        const keys = Object.keys(result)

        for (let i = 0; i < keys.length; i++) {
            let item = result[keys[i]]
            let key = keys[i]

            if (!(item instanceof Array) || item.length === 0) {
                continue
            }

            if (item.length === 1) {
                let val = item[0]

                if (typeof val === 'object') {
                    message[key] = formatMessage(val)
                } else {
                    message[key] = (val || '').trim()
                }
            } else {
                message[key] = []

                for (let j = 0; j < item.length; j++) {
                    message[key].push(formatMessage(item[j]))
                }
            }
        }
    }

    return message
}

/**
 * 封装xml消息模板
 * @param content
 * @param message
 * @returns {*}
 */
function tpl(content, message) {
    let type = 'text'

    if (Array.isArray(content)) {
        type = 'news'
    }

    if (!content) {
        content = 'Empty News'
    }

    if (content && content.type) {
        type = content.type
    }

    let info = Object.assign({}, {
        content: content,
        createTime: new Date().getTime(),
        msgType: type,
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName
    })

    return template(info)
}

export {
    parseXML,
    formatMessage,
    tpl,
    sign
}
