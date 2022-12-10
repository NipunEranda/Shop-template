import index from '..';

const getDefaultState = () => {
  return {
    currentUser: null,
  }
}

export default {
  state() {
    return getDefaultState();
  },
  getters: {
    getCurrentUser(state) {
      return state.currentUser;
    },
  },
  mutations: {
    resetState(state) {
      Object.assign(state, getDefaultState());
    },
    updateCurrentUser(state, data) {
      state.currentUser = data;
    },
  },
  actions: {
    resetState({ commit }) {
      commit('resetState')
    },
    updateCurrentUser(context, data) {
      context.commit("updateCurrentUser", data);
    },
  }
}