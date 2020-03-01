export default {
  state: {
    hotSearchOffsetY: 0,
    flipCardVisible: false
  },
  mutations: {
    SET_HOT_SEARCH_OFFSETY(state, offsetY) {
      state.hotSearchOffsetY = offsetY
    },
    SET_FLIP_CARD_VISIBLE(state, visible) {
      state.flipCardVisible = visible
    }
  }
}
