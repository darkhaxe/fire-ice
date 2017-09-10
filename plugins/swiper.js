import Vue from 'vue'

// you can see more in https://github.com/surmon-china/vue-awesome-swiper
//轮播图插件,nuxt.config.js配置使用:1.插件,2.css
if (process.BROWSER_BUILD) {
    const VueAwesomeSwiper = require('vue-awesome-swiper/ssr')
    Vue.use(VueAwesomeSwiper)
}
