<template lang="pug">
    .container
        .house(ref='house')
            .house-content(v-for='(item, index) in houses' :key='index' @click='focusHouse(item)')
                .house-text
                    .words {{ item.words }}
                    .cname {{ item.name }}
                    .name {{ item.cname }}
                .house-img-wrapper
                    img(:src="imageCDN + item.cname")

        .povCharacters
            .title 主要人物
            .povCharacter-wrapper
                .povCharacter-content(v-for='(item, index) in characters' :key='index' @click='focusCharacters(item)')
                    img(:src="imageCDN + item.profile + '?imageView2/1/w/280/h/440/format/jpg/q/75|imageslim'")
                    .povCharacter-text
                        .cname {{ item.cname }}
                        .name {{ item.name }}
                        .playedBy {{ item.playedBy }}

        .city
            .city-title 维斯特洛
            img.city-bg(src='http://oqncgivnd.bkt.clouddn.com/map/bg2.png')
            .city-intro 坐落于已知世界的最西端，狭长的维斯特洛大陆由北部的极地冰盖起向南延绵约3,000英里。绝境长城是一座巍峨挺立的不可逾越之物，横跨300英里，将最北的塞外地区与七大王国相互分离。一个统一的政治实体领导着南方的广阔土地，并形成九块相互联系又相互割据的区域。
            .city-item(v-for='(item, index) in cities' :key='index')
                .city-item-title {{ item.title }}
                .city-item-body {{ item.body }}
</template>

<script>
    import {mapState} from 'vuex'
    import city from '../server/database/json/city.json'

    export default {
        data() {
            return {
                cities: city //mock数据
            }
        },
        head() {
            return {
                title: '冰火脸谱'
            }
        },
        computed: {
            ...mapState([
                'imageCDN', 'houses', 'characters'
            ])
        }
        ,
        beforeCreate() { // 创建之前获取数据
            this.$store.dispatch('fetchHouses')
            this.$store.dispatch('fetchCharacters')
//            this.$store.dispatch('fetchCities')
        },

        methods: {
            focusHouse(item) {
                this.$router.push({
                    path: '/house',
                    query: {
                        id: item._id
                    }
                })
            },
            focusCharacters(item) {
                this.$router.push({
                    path: '/character',
                    query: {
                        id: item._id
                    }
                })
            }

        }
    }

</script>
<style scoped lang="sass" src='~static/sass/index.sass'></style>