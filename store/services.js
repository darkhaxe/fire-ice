import axios from 'axios'

const baseUrl = ''
const apiUrl = 'http://rapapi.org/mockjsdata/25102' //rap模拟数据

class Services {
    getWechatSignature(url) {
        return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
    }

    getUserByOAuth(url) {
        return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)
    }

    async fetchHouses() {
        return axios.get(`${apiUrl}/wiki/houses`)
    }

    async fetchCharacters() {
        return axios.get(`${apiUrl}/wiki/characters`)
    }

    async fetchCities() {
        return axios.get(`${apiUrl}/wiki/cities`)
    }

}

export default new Services()