import mongoose from 'mongoose'
import config from '../config/index'
import fs from 'fs'
import {resolve} from 'path'
import _ from 'lodash'

const models_path = resolve(__dirname, '../database/schema') // 读取schema定义
fs.readdirSync(models_path) // 同步读模型文件
    .filter(file => ~file.search(/^.*js$/)) // 后缀js文件
    .forEach(file => require(resolve(models_path, file)))

let characters = require('../database/json/allCharacters.json')
let houses = require('../database/json/allHouses.json')
// let books = require('../database/json/allBooks.json')
// let imdb = require('../database/json/IMDb.json')
let wikiCharacters = require('../database/json/wikiCharacters.json')
let wikiHouses = require('../database/json/wikiHouses.json')

export const database = app => {
    mongoose.set('debug', true)
    mongoose.connect(config.db)

    mongoose.connection.once('open', async () => { // 只执行一次
        console.log('connected to MongoDb')

        const Character = mongoose.model('Character')
        const WikiCharacter = mongoose.model('WikiCharacter')
        const WikiHouse = mongoose.model('WikiHouse')
        // const User = mongoose.model('User')

        // 说明第一次初始化插入数据已经完成

        characters = _.map(characters, formatData)
        houses = _.map(houses, formatData)

        // const _characters = _.filter(characters, character => character.playedBy && character.playedBy.length)

        let existCharacter = await Character.find({}).exec()
        if (!existCharacter.length) Character.insertMany(characters)

        let existWikiCharacter = await WikiCharacter.find({}).exec()
        if (!existWikiCharacter.length) WikiCharacter.insertMany(wikiCharacters)

        let existwikiHouses = await WikiHouse.find({}).exec()
        if (!existwikiHouses.length) WikiHouse.insertMany(wikiHouses)
    })

    mongoose.connection.on('disconnect', () => {
        mongoose.connect(config.db)
    })

    mongoose.connection.on('error', err => {
        console.log(err)
    })
}

const formatData = (item, index) => {
    item._id = item.url

    _.forIn(item, (value, key) => {
        if (!value || !value.length) delete item[key]
    })

    return item
}

const formatIMDb = (item, _characters) => {
    if (item.playedBy) {
        let character = _.find(_characters, character =>
            character.playedBy.includes(item.playedBy) && character.name === item.name)

        if (character) item.url = character.url
    }

    return item
}
