import axios from 'axios'

const baseUrl = ''//本地路径
const localhost = 'http://127.0.0.1:3000'
const apiUrl = 'http://rapapi.org/mockjsdata/21639' //rap模拟数据
// const apiUrl = 'http://rapapi.org/mockjsdata/25102' //rap模拟数据

class Services {
    getWechatSignature(url) {
        return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
    }

    getUserByOAuth(url) {
        return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)
    }

    fetchHouses() {
        return axios.get(`${localhost}/wiki/houses`)
    }

    fetchCharacters() {
        return axios.get(`${localhost}/wiki/characters`)
    }

    // fetchCities() {
    //     return axios.get(`${apiUrl}/wiki/cities`)
    // }

    fetchHouse(id) {
        return axios.get(`${localhost}/wiki/houses/${id}`)
    }

    fetchCharacter(id) {
        return axios.get(`${localhost}/wiki/characters/${id}`)
    }

    fetchProducts() {
        return axios.get(`${apiUrl}/wiki/products`)
    }

    fetchProduct(id) {
        return axios.get(`${apiUrl}/wiki/products/${id}`)
    }

    fetchUserAndOrders() {
        return axios.get(`${apiUrl}/api/user`)
    }

}

export default new Services()