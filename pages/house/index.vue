<template lang="pug">
    .container
        .focusHouse-media
            img(v-if='house.cname' :src="house.cname")
            .focusHouse-text
                .words {{ house.words }}
                .name {{ house.name }}

        .focusHouse-body
            .focusHouse-item-title {{ house.cname }}
            .focusHouse-item-body {{ house.intro }}

            .focusHouse-item-title 主要角色
            .focusHouse-item-body(v-for='(item, index) in house.swornMembers' :key='index')
                .swornMembers
                    img(:src="item.profile")
                    .swornMembers-body
                        .name {{ item.cname }}
                        .introduction {{ item.text }}

            .focusHouse-item-section(v-for='(item, index) in house.sections' :key='index')
                .focusHouse-item-title {{ item.title }}
                .focusHouse-item-body(v-for='text in house.content') {{text}}
</template>

<script>
    import {mapState} from 'vuex'

    export default {
//  middleware: 'wechat-auth',
//  transition: {
//    name: 'slide-left'
//  },
        head() {
            return {
                title: '家族详情'
            }
        },
        computed: {
            ...mapState({
//      imageCDN: 'imageCDN',
                house: 'currentHouse' //state.currentHouse
            })
        },
        beforeCreate() {
            let id = this.$route.query.id
            //调用actions.js的focusHouse()
            this.$store.dispatch('focusHouse', id)
        }
    }
</script>

<style scoped lang="sass" src='~static/sass/house.sass'></style>

