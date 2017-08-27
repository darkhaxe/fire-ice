//access_token 统一管理模块
//统一获取和刷新Access_token，其他业务逻辑服务器所使用的access_token均来自于该中控服务器，
// 不应该各自去刷新，否则容易造成冲突，导致access_token覆盖而影响业务；
import request from 'request-promise'
import fs from 'fs'
import * as _ from 'lodash'


const base_url = 'https://api.weixin.qq.com/cgi-bin'
const api = { //存放微信各类接口
    accessToken: base_url + '/token?grant_type=client_credential&appid=APPID&secret=APPSECRET',
    temporary: {//临时素材
        upload: base + 'media/upload?',
        fetch: base + 'media/get?'
    },
    permanent: { //永久素材
        upload: base + 'material/add_material?',
        uploadNews: base + 'material/add_news?',
        uploadNewsPic: base + 'media/uploadimg?',
        fetch: base + 'material/get_material?',
        del: base + 'material/del_material?',
        update: base + 'material/update_news?',
        count: base + 'material/get_materialcount?',
        batch: base + 'material/batchget_material?'
    },

}

export default class Wechat {
    constructor(opts) {
        this.opts = Object.assign({}, opts)
        this.appID = opts.appID
        this.appSecret = opts.appSecret
        this.getAccessToken = opts.getAccessToken
        this.saveAccessToken = opts.saveAccessToken
        this.fetchAccessToken()
    }

    async request(opts) {
        opts = Object.assign({}, opts, {json: true})
        try {
            const resp = await request(opts)
            console.log('/wechat-lib/index.js ------>' + resp)
            return resp
        } catch (e) {
            console.error(e)
        }
    }

    async fetchAccessToken() {
        if (this._isValid(data)) {
            return await this.updateAccessToken()
        }

    }

    async updateAccessToken() {
        const url = api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret
        const data = await this.request({url: url})
        //20s缓冲时间
        data.expires_in = new Date().getTime() + (data.expires_in - 20) * 1000
        return data
    }

    /**
     * 判断token是否有效
     * @param data
     */
    static _isValid(data) {
        if (!data || !data.access_token || !data.expires_in) {
            return false
        }
        return data.expires_in > new Date().getTime()
    }

    /**
     * 真正执行上传素材
     * @param operation 方法名:uploadMaterial/deleteMaterial/updateMaterial/countMaterial等等
     * @param args 各个方法的参数
     * @returns {Promise.<*>}
     */
    async handle(operation, ...args) {
        const tokenData = await this.fetchAccessToken()
        const options = this[operation](tokenData.access_token, ...args)
        return await this.request(options)
    }

    /**
     * 封装上传素材
     * @param token
     * @param type 素材类型:图片/图文/视频
     * @param material 图片等本地路径/url资源
     * @param permanent 永久/临时素材
     * @returns {{method: string, url: string, json: boolean}}
     */
    uploadMaterial(token, type, material, permanent) {
        let form = {} //构建表单
        let url = api.temporary.upload //上传地址

        if (permanent) {
            url = api.permanent.upload

            _.extend(form, permanent)
        }

        if (type === 'pic') {
            url = api.permanent.uploadNewsPic
        }

        if (type === 'news') { //图文
            url = api.permanent.uploadNews
            form = material
        } else { //图片或视频
            form.media = fs.createReadStream(material)
        }

        let uploadUrl = url + 'access_token=' + token
        //----------------------拼接url区分-------------------------
        if (!permanent) {
            uploadUrl += '&type=' + type
        } else {
            if (type !== 'news') {
                form.access_token = token
            }
        }
        //-----------------------------------------------

        const options = {
            method: 'POST',
            url: uploadUrl,
            json: true
        }

        if (type === 'news') {
            options.body = form
        } else { //图片上传的表单域
            options.formData = form
        }

        return options
    }

    deleteMaterial(token, mediaId) {
        const form = {
            media_id: mediaId
        }
        const url = api.permanent.del + 'access_token=' + token + '&media_id' + mediaId

        return {method: 'POST', url: url, body: form}
    }

    updateMaterial(token, mediaId, news) {
        const form = {
            media_id: mediaId
        }

        _.extend(form, news)
        const url = api.permanent.update + 'access_token=' + token + '&media_id=' + mediaId

        return {method: 'POST', url: url, body: form}
    }

    countMaterial(token) {
        const url = api.permanent.count + 'access_token=' + token

        return {method: 'POST', url: url}
    }

    batchMaterial(token, options) {
        options.type = options.type || 'image'
        options.offset = options.offset || 0
        options.count = options.count || 10

        const url = api.permanent.batch + 'access_token=' + token

        return {method: 'POST', url: url, body: options}
    }

}