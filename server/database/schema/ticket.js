// Schema:存放全局票据
// 给mongoose查询绑定自定义方法,最后一行
const mongoose = require('mongoose')

// 字段定义
const TicketSchema = new mongoose.Schema(
    {
        name: String, // token名
        ticket: String, // token值
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
const TicketModel = mongoose.model('Ticket', TicketSchema)

// 存储前执行此回调函数
TicketSchema.pre('save', function (next) {
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
TicketSchema.statics = {
    async getTicket() {
        return await this.findOne({name: 'ticket'}).exec()
    },
    async saveTicket(data) {
        let doc = await this.findOne({name: 'ticket'}).exec()
        if (doc) {
            doc.ticket = data.ticket
            doc.expires_in = data.expires_in
        } else {
            doc = new TicketModel({
                name: 'ticket',
                ticket: data.ticket,
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
