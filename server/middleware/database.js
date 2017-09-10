import mongoose from 'mongoose'
import config from '../config/index'
import fs from 'fs'
import {resolve} from 'path'

const models_path = resolve(__dirname, '../database/schema') //读取schema定义
fs.readdirSync(models_path) //同步读模型文件
    .filter(file => ~file.search(/^.*js$/)) //后缀js文件
    .forEach(file => require(resolve(models_path, file)))

//爬取清洗的数据,入库



export const database = app => {
    mongoose.set('debug', true)
    mongoose.connect(config.db)
    mongoose.connection.on('disconnect', () => {
        mongoose.connect(config.db)
    })
    mongoose.connection.on('error', err => {
        console.log(err)
    })
    mongoose.connection.on('open', async () => {
        console.log('connected to MongoDb')
    })
}