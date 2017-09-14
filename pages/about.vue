<template>
    <section class="container">
        <img src="../static/images/logo.png" alt="Nuxt.js Logo" class="logo"/>
        <h1 class="title">
            This page is loaded from the {{ name }}
        </h1>
        <h2 class="info" v-if="name === 'client'">
            Please refresh the page
        </h2>
        <nuxt-link class="button" to="/">
            Home page
        </nuxt-link>
    </section>
</template>
<script>
    //  import {mapState} from 'vuex'

    export default {
        asyncData({req}) {
            return {
                name: req ? 'server' : 'client'
            }
        },
        head() {
            return {
                title: `测试页面`
            }
        },
        // 装载前
        beforeMount() {
//      console.log('beforeAmount')
            let wx = window.wx
            let url = 'wechat-signature'// window.location.href
            // 1.触发store状态变更
            // 2.services.js的getWechatSignature(),发出axios请求
            // 3./server/router.js截获->交由/controllers/wechat.js处理
            // 4.后端返回,进入res=>{}回调函数
            this.$store.dispatch('getWechatSignature', url)
                .then(res => {
                    if (res.data.success) {
                        let params = res.data.params
                        // 注入参数,wechatJS进行权限验证
                        wx.config({
                            debug: true,
                            appId: params.appID, // 公众号唯一标识
                            timestamp: params.timestamp,
                            noncestr: params.noncestr,
                            signature: params.signature,
                            jsApiList: [
                                'chooseImage',
                                'previewImage',
                                'uploadImage',
                                'downloadImage',
                                'onMenuShareTimeline',
                                'hideAllNoneBaseMenuItem'
                            ]
                        })
                        wx.ready(() => {
                            wx.hideAllNoneBaseMenuItem()
                            console.log('ready')
                        })
                    }
                })
        }
    }
</script>

<style scoped>
    .title {
        margin-top: 50px;
    }

    .info {
        font-weight: 300;
        color: #9aabb1;
        margin: 0;
        margin-top: 10px;
    }

    .button {
        margin-top: 50px;
    }
</style>
