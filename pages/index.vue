<template lang="pug">
    .container
        .house(ref="house")
            .items(v-for='(item ,index) in houses' :key='index'
                @click='showHouse(item)')
                .desc
                    .words {{item.words}}
                    .cname {{item.cname}}
                    .name {{item.name}}
        .characters
            .title 主要人物
            .section
                .items(v-for='(item, index) in characters'
                    :key='index' @click='showCharacter(item)')
                    img(:src='item.profile')
                        .desc
                            .cname {{item.cname}}
                            .name {{item.name}}
                            .playedBy {{item.playedBy}}
        .city
            .title 维斯特洛
            .intro xxxx描述
            .items(v-for='(item, index) in cities' :key='index')
                .title {{item.title}}
                .body {{item.body}}
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        head() {
            return {
                title: '冰火脸谱'
            }
        },
        computed: {
            ...mapState([
                'houses', 'characters', 'cities'
            ]),
        }
        ,
        beforeCreate() { //创建之前获取数据
            this.$store.dispatch('fetchHouse')
            this.$store.dispatch('fetchCharacter')
            this.$store.dispatch('fetchCity')
        }

        , methods: {
            showHouse(item) {
                this.$router.push({
                    path: '/house',
                    query: {
                        id: item._id
                    }
                })
            },
            showCharacter(item) {
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

<style scoped>
    .title {
        margin: 50px 0;
    }
</style>
