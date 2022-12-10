<template>
  <div class="container">
    <div class="row" style="padding-top: 150px; padding-bottom: 40px">
      <div class="col-12">
        <img class="login-logo" src="../assets/logo.png" width="200" />
      </div>
    </div>
    <div class="container">
      <div id="googleBtn" style="margin: auto"></div>
    </div>
  </div>
</template>

<style scoped>
.login-logo {
  width: 200px;
  display: flex;
  margin-left: auto;
  margin-right: auto;
}
.container {
  text-align: center;
  display: grid;
}
</style>

<script>
import router from "../router";
import { useStore } from "vuex";
import store from "../store";
export default {
  setup: () => {},
  data() {
    return {
      store: useStore(),
      user: store.getters.getCurrentUser,
    };
  },
  methods: {},
  mounted: function () {
    if (this.user) {
      if (this.user.token) this.$router.push("/home");
    } else {
      google.accounts.id.initialize({
        client_id:
          process.env.VUE_APP_GOOGLE_ID,
        callback: onSignIn,
      });
      google.accounts.id.prompt();
      google.accounts.id.renderButton(document.getElementById("googleBtn"), {
        theme: "outline",
        size: "large",
        text: "signin_with",
        type: "standard",
        shape: "pill",
        logo_alignment: "left",
      });
      function onSignIn(googleUser) {
        axios
          .get(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${googleUser.credential}`
          )
          .then((response) => {
            axios
              .post(`/.netlify/functions/auth/google`, response.data)
              .then((res) => {
                if (!res.data.error) {
                  store.dispatch("updateCurrentUser", {
                    email: response.data.email,
                    name: response.data.name,
                    sub: response.data.sub,
                    token: res.data.data.token,
                    id: res.data.data.user._id,
                    loggedIn: new Date(),
                  });
                  if (store.getters.getRedirectUrl)
                    router.push(store.getters.getRedirectUrl);
                  else router.push("/home");
                }
              });
          });
      }
    }
  },
};
</script>
