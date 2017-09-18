import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const createStore = () => {
    return new Vuex.Store({
        state: {
            imageCDN: 'http://owgk6d07w.bkt.clouddn.com/',
            houses: [],
            cities: [],
            characters: [],
            products: [],
            currentHouse: {},
            currentCharacter: {},
            currentProduct: {},
            authUser: {}// 5-9

        },
        getters,
        actions,
        mutations
    })
}

export default createStore
