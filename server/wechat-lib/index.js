// access_token 统一管理模块
// 统一获取和刷新Access_token，其他业务逻辑服务器所使用的access_token均来自于该中控服务器，
// 不应该各自去刷新，否则容易造成冲突，导致access_token覆盖而影响业务；
import request from 'request-promise'
import fs from 'fs'
import * as _ from 'lodash'
import * as util from './util'

const base = 'https://api.weixin.qq.com/cgi-bin'
const api = { // 存放微信各类接口
    accessToken: base + '/token?grant_type=client_credential&appid=APPID&secret=APPSECRET',
    temporary: {// 临时素材
        upload: base + 'media/upload?',
        fetch: base + 'media/get?'
    },
    permanent: { // 永久素材
        upload: base + 'material/add_material?',
        uploadNews: base + 'material/add_news?',
        uploadNewsPic: base + 'media/uploadimg?',
        fetch: base + 'material/get_material?',
        del: base + 'material/del_material?',
        update: base + 'material/update_news?',
        count: base + 'material/get_materialcount?',
        batch: base + 'material/batchget_material?'
    },
    tag: { // 标签管理
        create: base + 'tags/create?',
        fetch: base + 'tags/get?',
        update: base + 'tags/update?',
        del: base + 'tags/delete?',
        fetchUsers: base + 'user/tag/get?',
        batchTag: base + 'tags/members/batchtagging?',
        batchUnTag: base + 'tags/members/batchuntagging?',
        getTagList: base + 'tags/getidlist?'
    },
    user: { // 用户管理
        remark: base + 'user/info/updateremark?',
        info: base + 'user/info?',
        batchInfo: base + 'user/info/batchget?',
        fetchUserList: base + 'user/get?',
        getBlackList: base + 'tags/members/getblacklist?',
        batchBlackUsers: base + 'tags/members/batchblacklist?',
        batchUnblackUsers: base + 'tags/members/batchunblacklist?'
    },
    menu: {
        create: base + 'menu/create?',
        get: base + 'menu/get?',
        del: base + 'menu/delete?',
        addCondition: base + 'menu/addconditional?',
        delCondition: base + 'menu/delconditional?',
        getInfo: base + 'get_current_selfmenu_info?'
    },
    ticket: {
        get: base + 'ticket/getticket?'
    }

}

export default class WechatApi {
    constructor(opts) {
        this.opts = Object.assign({}, opts)
        this.appID = opts.appID
        this.appSecret = opts.appSecret
        // 方法
        this.getAccessToken = opts.getAccessToken
        this.saveAccessToken = opts.saveAccessToken
        this.getTicket = opts.getTicket
        this.saveTicket = opts.saveTicket
        this.fetchAccessToken()
    }

    /**
     * 判断token是否有效
     */
    static _isValid(data, field) {
        if (!data || !data[field] || !data.expires_in) {
            return false
        }
        return data.expires_in > new Date().getTime()
    }

    /**
     *统一请求wechat
     */
    async requestWechat(opts) {
        opts = Object.assign({}, opts, {json: true})
        try {
            return await request(opts)
        } catch (e) {
            console.error(e)
        }
    }

    /**
     * 动态调用本类方法
     * @param operation 方法名:uploadMaterial/deleteMaterial/updateMaterial/countMaterial等等
     * @param args 各个方法的参数
     * @returns {Promise.<*>}
     */
    async handle(operation, ...args) {
        const tokenData = await this.fetchAccessToken()
        const options = this[operation](tokenData.access_token, ...args)
        return await this.requestWechat(options)
    }

    /**
     * 生成sha1签名
     * @param ticket
     * @param url
     * @returns {{noncestr, timestamp, signature}|*}
     */
    sign(ticket, url) {
        return util.sign(ticket, url)
    }

    async fetchAccessToken() {
        let data = await this.getAccessToken
        if (this._isValid(data, 'token')) {
            return await this.updateAccessToken()
        }
        await this.saveAccessToken(data)
        return data
    }

    async fetchTicket() {
        let data = await this.getTicket()
        if (this._isValid(data, 'ticket')) {
            return await this.updateTicket()
        }
    }

    async updateAccessToken() {
        const url = api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret
        let data = await this.requestWechat({url: url})
        // 20s缓冲时间
        data.expires_in = new Date().getTime() + (data.expires_in - 20) * 1000
        return data
    }

    async updateTicket(token) {
        const url = api.ticket.get + '&access_token=' + token + '&type=jsapi'
        let data = await this.requestWechat({url: url})
        // 20s缓冲时间
        data.expires_in = new Date().getTime() + (data.expires_in - 20) * 1000
        return data
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
        let form = {} // 构建表单
        let url = api.temporary.upload // 上传地址

        if (permanent) {
            url = api.permanent.upload

            _.extend(form, permanent)
        }

        if (type === 'pic') {
            url = api.permanent.uploadNewsPic
        }

        if (type === 'news') { // 图文
            url = api.permanent.uploadNews
            form = material
        } else { // 图片或视频
            form.media = fs.createReadStream(material)
        }

        let uploadUrl = url + 'access_token=' + token
        // ----------------------拼接url区分-------------------------
        if (!permanent) {
            uploadUrl += '&type=' + type
        } else {
            if (type !== 'news') {
                form.access_token = token
            }
        }
        // -----------------------------------------------

        const options = {
            method: 'POST',
            url: uploadUrl,
            json: true
        }

        if (type === 'news') {
            options.body = form
        } else { // 图片上传的表单域
            options.formData = form
        }

        return options
    }

    deleteMaterial(token, mediaId) {
        const form = {
            media_id: mediaId
        }
        const url = api.permanent.del + 'access_token=' + token + '&media_id' + mediaId
        // 发送请求的配置项
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

    createTag(token, name) {
        const form = {
            tag: {
                name: name
            }
        }
        const url = api.tag.create + 'access_token=' + token

        return {method: 'POST', url: url, body: form}
    }

    fetchTags(token) {
        const url = api.tag.fetch + 'access_token=' + token

        return {url: url}
    }

    updateTag(token, tagId, name) {
        const form = {
            tag: {
                id: tagId,
                name: name
            }
        }

        const url = api.tag.update + 'access_token=' + token

        return {method: 'POST', url: url, body: form}
    }

    delTag(token, tagId) {
        const form = {
            tag: {
                id: tagId
            }
        }

        const url = api.tag.del + 'access_token=' + token

        return {method: 'POST', url: url, body: form}
    }

    remarkUser(token, openId, remark) {
        const form = {
            openid: openId,
            remark: remark
        }
        const url = api.user.remark + 'access_token=' + token

        return {method: 'POST', url: url, body: form}
    }

    getUserInfo(token, openId, lang) {
        const url = `${api.user.info}access_token=${token}&openid=${openId}&lang=${lang || 'zh_CN'}`

        return {url: url}
    }

    batchUserInfo(token, userList) {
        const url = api.user.batchInfo + 'access_token=' + token
        const form = {
            user_list: userList
        }

        return {method: 'POST', url: url, body: form}
    }

    fetchUserList(token, openId) {
        const url = `${api.user.fetchUserList}access_token=${token}&next_openid=${openId || ''}`

        return {url: url}
    }

    createMenu(token, menu) {
        const url = api.menu.create + 'access_token=' + token

        return {method: 'POST', url: url, body: menu}
    }

    getMenu(token) {
        const url = api.menu.get + 'access_token=' + token

        return {url: url}
    }

    delMenu(token) {
        const url = api.menu.del + 'access_token=' + token

        return {url: url}
    }

    addConditionMenu(token, menu, rule) {
        const url = api.menu.addCondition + 'access_token=' + token
        const form = {
            button: menu,
            matchrule: rule
        }

        return {method: 'POST', url: url, body: form}
    }

    delConditionMenu(token, menuId) {
        const url = api.menu.delCondition + 'access_token=' + token
        const form = {
            menuid: menuId
        }

        return {method: 'POST', url: url, body: form}
    }

    getCurrentMenuInfo(token) {
        const url = api.menu.getInfo + 'access_token=' + token

        return {url: url}
    }
}
