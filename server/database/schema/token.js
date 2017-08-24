//存放全局票据 Schema

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TokenSchema = new mongoose.Schema(
    {
        name: String, //token名
        access_token: String, //token
        expires_in: Number, //过期时间
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
//存储前执行此回调函数
TokenSchema.pre('save', function (next) {
    "use strict";
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }
    next()
})

//静态方法
//方法间需要加上逗号
TokenSchema.statics = {
    async getAccessToken() {
        const token = await this.findByOne({
            name: 'access_token'
        }).exec()
        if (token && token.token) {
            token.access_token = token.token
        }
        return token
    },
    async saveAccessToken(data) {
        let token = await this.findOne({name: 'access_token'}).exec()
        if (token) {
            token.token = data.access_token
            token.expires_in = data.expires_in
        } else {
            token = new Token({
                name: 'access_token',
                token: data.access_token,
                expires_in: data.expires_in,
            })
        }
        await token.save()
        return data
    }
}

const Token = mongoose.model('Token', TokenSchema)
