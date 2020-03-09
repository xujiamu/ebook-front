export default {
  state: {
    hotSearchOffsetY: 0,
    flipCardVisible: false,
    isEditMode: false, // 是否进入编辑模式(书架和分组通用)
    shelfList: [], // 书架图书列表
    shelfSelected: [], // 图书选中列表(书架和分组通用)
    shelfTitleVisible: true, // 标题的显示状态(书架和分组通用)
    shelfCategory: {}, // 书架分组数据对象
    currentType: 1 // 区分书架和书架分组 书架为1，书架分组为2
  },
  mutations: {
    SET_HOT_SEARCH_OFFSETY(state, offsetY) {
      state.hotSearchOffsetY = offsetY
    },
    SET_FLIP_CARD_VISIBLE(state, visible) {
      state.flipCardVisible = visible
    },
    SET_IS_EDIT_MODE(state, isEditMode) {
      state.isEditMode = isEditMode
    },
    SET_SHELF_LIST(state, list) {
      state.shelfList = list
    },
    SET_SHELF_SELECTED(state, selected) {
      state.shelfSelected = selected
    },
    SET_SHELF_TITLE_VISIBLE(state, visible) {
      state.shelfTitleVisible = visible
    },
    SET_SHELF_CATEGORY(state, category) {
      state.shelfCategory = category
    },
    SET_CURRENT_TYPE(state, type) {
      state.currentType = type
    }
  }
}
