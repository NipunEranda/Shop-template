<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark ps-0 pe-0">
    <div class="container-fluid" style="width: 80%;">
      <router-link class="navbar-brand text" href="#" to="/home" style="letter-spacing: 8px">
        <img src="../assets/logo.png" width="30" height="30" class="d-inline-block align-top" alt="" />
        SHOP
      </router-link>
      <button class="navbar-toggler fs-6" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <router-link class="nav-item text" to="/categories"><a class="nav-link" href="#">CATEGORIES</a></router-link>
          <router-link class="nav-item text" to="/sale"><a class="nav-link" href="#">SALE</a></router-link>
          <router-link class="nav-item text" to="/sale"><a class="nav-link" href="#">CONTACT</a></router-link>
          <!-- <router-link class="nav-item" to="/users"><a class="nav-link" href="#">Users</a></router-link> -->
        </ul>
      </div>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav ms-auto">
          <router-link class="nav-item" to="/cart"><a class="nav-link" href="#"><i
                class="fa fa-shopping-cart d-none d-md-flex"></i><label class="d-md-none">Cart</label></a></router-link>
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a class="nav-link" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                <i class="fa fa-user d-none d-md-flex"></i><label class="d-md-none">Account</label>
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <li><a class="dropdown-item" href="#">{{ user ? user.name : "" }}</a></li>
                <li><a class="dropdown-item" aria-current="page" @click="this.$store.dispatch('logout')"
                    style="cursor: pointer">Logout</a></li>
              </ul>
            </li>
          </ul>
        </ul>
      </div>
    </div>
  </nav>

</template>

<script>
import store from "../store";
import { useStore } from "vuex";
export default {
  data() {
    return {
      store: useStore(),
      user: store.getters.getCurrentUser,
    };
  },
  watch: {
    user: function () {
      if (!this.user) this.$router.push("/");
    },
  },
  methods: {
  },
};
</script>

<style scoped>
.text {
  /*font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;*/
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-style: normal;
}

.nav-item {
  text-decoration: none !important;
}

.navbar-brand {
  font-weight: bolder;
}
</style>