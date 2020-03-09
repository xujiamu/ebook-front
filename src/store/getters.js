const book = {
  fileName: state => state.book.fileName,
  menuVisible: state => state.book.menuVisible,
  settingVisible: state => state.book.settingVisible,
  defaultFontSize: state => state.book.defaultFontSize,
  currentBook: state => state.book.currentBook,
  defaultFontFamily: state => state.book.defaultFontFamily,
  fontFamilyVisible: state => state.book.fontFamilyVisible,
  defaultTheme: state => state.book.defaultTheme,
  progress: state => state.book.progress,
  bookAvailable: state => state.book.bookAvailable,
  section: state => state.book.section,
  cover: state => state.book.cover,
  metadata: state => state.book.metadata,
  navigation: state => state.book.navigation,
  offsetY: state => state.book.offsetY,
  isBookmark: state => state.book.isBookmark,
  hotSearchOffsetY: state => state.store.hotSearchOffsetY,
  flipCardVisible: state => state.store.flipCardVisible,
  isEditMode: state => state.store.isEditMode,
  shelfList: state => state.store.shelfList,
  shelfSelected: state => state.store.shelfSelected,
  shelfTitleVisible: state => state.store.shelfTitleVisible,
  shelfCategory: state => state.store.shelfCategory,
  currentType: state => state.store.currentType
}

export default book
