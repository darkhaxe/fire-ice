const mongoose = require('mongoose')
const {Schema} = mongoose
const Mixed = Schema.Types.Mixed

const HouseSchema = new Schema({
    name: String,
    cname: String,
    words: String,
    intro: String,
    cover: String,
    wikiId: Number,
    sections: Mixed, // 混合数组
    swornMembers: [
        {
            character: {type: String, ref: 'WikiCharacter'},
            text: String
        }
    ]
})

mongoose.model('WikiHouse', HouseSchema)
