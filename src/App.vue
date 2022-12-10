<template>
  <div>
    <div class="container-loader hidden"><div class="loader"></div></div>
    <Header v-if="showHeader"></Header>
    <router-view class="container-body" />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import store from './store';
import { useStore } from "vuex";
export default {
  data() {
    return {
      store: useStore(),
      user: store.getters.getCurrentUser,
      showHeader: false,
    };
  },
  watch: {
    $route: function (to, from) {
      if (to.name === "index" && !this.user) this.showHeader = false;
      else this.showHeader = true;
    },
  },
  components: {
    Header,
  },
};
</script>

<style>
  .container-body{
    padding: 10px;
  }
    @import url('./assets/css/index.css');
</style>