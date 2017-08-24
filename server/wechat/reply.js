//回复策略

const tip = '1万两千年的友情!click-><a href="http://www.baidu.com">Gunbuster</a>'

export default async (ctx, next) => {
    const msg = ctx.weixin
    console.log('reply.js -->' + msg)
    ctx.body = tip

}