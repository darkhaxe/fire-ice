const {resolve} = require('path')
const r = path => resolve(__dirname, path)
// console.log(`start.js-->r=${r} `)
require('babel-core/register')({
    'presets': [
        'stage-3',
        'latest-node'
    ],
    'plugins': [
        // 'transform-decorators-legacy',
        ['module-alias', [
            {'src': r('./server'), 'expose': '~'},
            {'src': r('./server/database'), 'expose': 'database'}
        ]]
    ]
})

//babel转换,与引入server下的真正启动文件
require('babel-polyfill')
require('./server')