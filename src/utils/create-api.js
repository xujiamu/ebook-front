import CreateAPI from 'vue-create-api'
import Vue from 'vue'
// 引入消息框组件
import Toast from '../components/common/Toast'
// 引入弹出框组件
import Popup from '../components/common/Popup'
// 引入对话框组件
import GroupDialog from '../components/shelf/ShelfGroupDialog'

// 通过use方法使用插件
Vue.use(CreateAPI)
// 调用 createAPI 生成对应 API，并挂载到 Vue.prototype 和 Toast 对象上,之后就可以通过Api使用Toast组件
Vue.createAPI(Toast, true)
Vue.createAPI(Popup, true)
Vue.createAPI(GroupDialog, true)
// 将Toast组件的api调用绑定到全局混入中
Vue.mixin({
  methods: {
    toast(settings) {
      return this.$createToast({
        $props: settings
      })
    },
    popup(settings) {
      return this.$createPopup({
        $props: settings
      })
    },
    // 对toast方法，进一步简化只传text，之后调用show的封装
    simpleToast(text) {
      const toast = this.toast({
        text: text
      })
      toast.show()
      toast.updateText(text)
    },
    dialog(setting) {
      return this.$createGroupDialog({
        $props: setting
      })
    }
  }
})
