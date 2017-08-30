import Services from './services'
import axios from 'axios'

export default {

    async fetchHouses({state}) {
        const res = await Services.fetchHouses()
        state.houses = res.data.data

        return res
    },

    async fetchCharacters({state}) {
        const res = await Services.fetchCharacters()

        state.characters = res.data.data
        return res
    },

    async fetchCities({state}) {
        const res = await Services.fetchCities()

        state.cities = res.data.data
        return res
    },


}