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
        state.houses = res.data.data
        // console.log(res.data[0].data)
        return res
    },

    async fetchCharacters({state}) {
        const res = await Services.fetchCharacters()
        state.characters = res.data.data
        // console.log(state.characters)
        return res
    },
//改为mock数据
    // async fetchCities({state}) {
    //     const res = await Services.fetchCities()
    //     state.cities = res.data.data
    //     // console.log(state.cities)
    //     return res
    // },

    async focusHouse({state}, _id) {
        if (_id === state.currentHouse._id) return
        const res = await Services.fetchHouse(_id)
        state.currentHouse = res.data.data
        // console.log(state.currentHouse)
        return state.currentHouse
    },
    async focusCharacter({state}, _id) {
        if (_id === state.currentCharacter._id) return
        let res = await Services.fetchCharacter(_id)
        // console.log(res)
        state.currentCharacter = res.data.data
        // console.log(state.currentCharacter)
        return state.currentCharacter
    },
    async fetchProducts({state}) {
        let res = await Services.fetchProducts()
        state.products = res.data.data
        return res
    },
    async focusProduct({state}, _id) {
        if (_id === state.currentProduct._id) return
        let res = await Services.fetchProduct(_id)
        // console.log(res)
        state.currentProduct = res.data.data
        return res
    },
    async fetchUserAndOrders({state}) {
        const res = await Services.fetchUserAndOrders()
        state.authUser = res.data.data
        return res
    },
    /**
     * 保存商品
     * @param state
     * @param dispatch
     * @param product
     * @returns {Promise.<void>}
     */
    async saveProduct({state, dispatch}, product) {
        await axios.post('/api/products', product)
        let res = await dispatch('fetchProducts')

        return res.data
    },
    /**
     * 更新商品
     * @param state
     * @param dispatch
     * @param product
     * @returns {Promise.<void>}
     */
    async putProduct({state, dispatch}, product) {
        await axios.put('/api/products', product)
        let res = await dispatch('fetchProducts')

        return res.data
    },

}
