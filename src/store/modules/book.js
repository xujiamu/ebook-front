export default {
  state: {
    test: 1
  },
  mutations: {
    'CHANGE_TEST'(state, arg) {
      state.test = arg
    }
  },
  actions: {
    changeTest({ commit, state }, arg) {
      return commit('CHANGE_TEST', arg)
    }
  }
}
