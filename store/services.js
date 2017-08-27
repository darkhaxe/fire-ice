import axios from 'axios'

const baseUrl = ''
const apiUrl = 'http://rapapi.org/mockjsdata/25102/'

class Services {
    getWechatSignature(url) {
        return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
    }

    getWechatSignature(url) {
        return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)
    }

    fetchHouses() {
        return axios.get(`${apiUrl}/wiki/houses`)
    }

    fetchCharacters() {
        return axios.get(`${apiUrl}/wiki/characters`)
    }

    fetchCities() {
        return axios.get(`${apiUrl}/wiki/cities`)
    }

}

export default new Services()