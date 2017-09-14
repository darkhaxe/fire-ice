// Schema:存放全局票据
// 给mongoose查询绑定自定义方法,最后一行
const mongoose = require('mongoose')

// 字段定义
const TokenSchema = new mongoose.Schema(
    {
        name: String, // token名
        access_token: String, // token值
        expires_in: Number, // 过期时间
        meta: {
            createdAt: {
                type: Date,
                default: Date.now()
            },
            updatedAt: {
                type: Date,
                default: Date.now()
            }
        }
    }
)

// 绑定TokenSchema到mongoose.model(),在服务启动之后全局可以使用mongoose.model('Token')获取自定义的方法
const TokenModel = mongoose.model('Token', TokenSchema)

// 存储前执行此回调函数
TokenSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }
    // 回调,交出控制权
    next()
})

// 静态方法
// 方法间需要加上逗号
TokenSchema.statics = {
    async getTicket() {
        return await this.findOne({name: 'access_token'}).exec()
        // if (token && token.token) {
        //     token.access_token = token.token
        // }
    },
    async saveTicket(data) {
        let doc = await this.findOne({name: 'access_token'}).exec()
        if (doc) {
            doc.access_token = data.access_token
            doc.expires_in = data.expires_in
        } else {
            doc = new TokenModel({
                name: 'access_token',
                access_token: data.access_token,
                expires_in: data.expires_in
            })
        }
        try {
            await doc.save()
        } catch (e) {
            console.error('存储失败:' + e)
        }
        return data
    }
}
