module.exports = {
    /*
    ** Headers of the page
    */
    head: {
        title: 'starter',
        meta: [
            {charset: 'utf-8'},
            {hid: 'description', name: 'description', content: 'Nuxt.js project'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ],
        script: [
            {src: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js'},
            {src: 'http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js'}//根据设备动态适配比例}
        ]
    },
    /*
    ** Global CSS
    */
    css: [
        { //sass目录
            src: 'static/sass/base.sass',
            lang: 'sass?indentedSyntax=true'
        },
        {//轮播图的css
            src: 'swiper/dist/css/swiper.css'
        }
    ],

    plugins: [
        {src: '~plugins/swiper.js', ssr: false},//轮播图,vue-awesome-swiper
    ],
    /*
    ** Customize the progress-bar color
    */
    loading: {color: '#3B8070'}
}
