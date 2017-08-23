//babel转换,与引入server下的真正启动文件
require('babel-core/register')({
    'presets': [
        'stage-3',
        'latest-node'
    ]
})

require('babel-polyfill')
require('./server')