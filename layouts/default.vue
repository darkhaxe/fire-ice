<template lang="pug">
    #app
        #main
            nuxt
        v-nav
</template>

<script>
    import vNav from '~components/nav.vue' //底部导航栏

export default {
  components: {
      vNav
  }
}
</script>