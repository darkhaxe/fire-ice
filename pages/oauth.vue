<template>
  <section class="container">
    <img src="../static/images/logo.png" alt="Nuxt.js Logo" class="logo"/>
    <h1 class="title">
      This page is loaded from the {{ name }}
    </h1>
    <h2 class="info" v-if="name === 'client'">
      Please refresh the page
    </h2>
    <nuxt-link class="button" to="/">
      Home page
    </nuxt-link>
  </section>
</template>
<script>
    import {mapState} from 'vuex'

    export default {
        asyncData({req}) {
            return {
                name: req ? 'server' : 'client'
            }
        },
        head() {
            return {
                title: `test page 170907`
            }
        },
        computed: {
            ...mapState(['baseUrl'])
        },
        beforeMount() {
            let url = window.location.href
            this.$store.dispatch('getUserByOAuth', encodeURIComponent(url))
                .then(res => {
                    if (res.data.success) {
                        console.log(res.data)
                    }
                })
        }
    }
</script>

<style scoped>
  .title {
    margin-top: 50px;
  }

  .info {
    font-weight: 300;
    color: #9aabb1;
    margin: 0;
    margin-top: 10px;
  }

  .button {
    margin-top: 50px;
  }
</style>
