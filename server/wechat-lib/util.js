//JSON<->XML 转换工具类

import xml2js from 'xml2js'

function parseXML(xml) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, {trim: true}, (err, content) => {
            if (err) reject(err)
            else resolve(content)
        })
    })
}

export {
    parseXML
}