import { createStore } from 'vuex';
import createPersistedState from "vuex-persistedstate";
import auth from './auth';
import router from '@/router';

const store = createStore({
    modules: {
        auth: auth,
    },
    plugins: [createPersistedState()],
    actions: {
        logout(){
            this.commit('resetState');
            router.push("/");
        },
    },
});

export default store;