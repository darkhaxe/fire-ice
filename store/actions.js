import Services from './services'

export default {
    getWechatSignature({commit}, url) {
        return Services.getWechatSignature(url)
    },

    getUserByOAuth({commit}, url) {
        return Services.getUserByOAuth(url)
    },

    async fetchHouses({state}) {
        const res = await Services.fetchHouses()
        state.houses = res.data[0].data //todo 奇怪的数据结构
        // console.log(res.data[0].data)
        return state.houses
    },

    async fetchCharacters({state}) {
        const res = await Services.fetchCharacters()
        state.characters = res.data.data
        console.log(state.characters)
        return state.characters
    },

    async fetchCities({state}) {
        const res = await Services.fetchCities()
        state.cities = res.data.data
        // console.log(state.cities)
        return state.cities
    },


}