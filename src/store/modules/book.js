export default {
  state: {
    fileName: '',
    menuVisible: false,
    settingVisible: -1,
    defaultFontSize: 16,
    currentBook: null,
    defaultFontFamily: 'Default',
    fontFamilyVisible: false,
    defaultTheme: 'default',
    progress: 0,
    bookAvailable: false,
    section: 0
  },
  mutations: {
    'SET_FILENAME'(state, fileName) {
      state.fileName = fileName
    },
    'SET_MENUVISIBLE'(state, menuVisible) {
      state.menuVisible = menuVisible
    },
    'SET_SETTINGVISIBLE'(state, settingVisible) {
      state.settingVisible = settingVisible
    },
    'SET_DEFAULTFONTSIZE'(state, defaultFontSize) {
      state.defaultFontSize = defaultFontSize
    },
    'SET_CURRENT_BOOK'(state, currentBook) {
      state.currentBook = currentBook
    },
    'SET_DEFAULT_FONT_FAMILY'(state, defaultFontFamily) {
      state.defaultFontFamily = defaultFontFamily
    },
    'SET_FONT_FAMILY_VISIBLE'(state, fontFamilyVisible) {
      state.fontFamilyVisible = fontFamilyVisible
    },
    'SET_DEFAULT_THEME'(state, defaultTheme) {
      state.defaultTheme = defaultTheme
    },
    'SET_PROGRESS'(state, progress) {
      state.progress = progress
    },
    'SET_BOOK_AVAILABLE'(state, bookAvailable) {
      state.bookAvailable = bookAvailable
    },
    'SET_SECTION'(state, section) {
      state.section = section
    }
  }
}
