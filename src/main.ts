import { createSSRApp } from "vue"
import App from "./App.vue"
import initRouter from './router'
import ElementPlus from 'element-plus'
import pinia from "./stores"
import { registerIcons } from '/@/utils/common'
import { loadLang } from '/@/lang/index'
import { directives } from '/@/utils/directives'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import 'font-awesome/css/font-awesome.min.css'
import '/@/styles/index.scss'

export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  initRouter(app)
  loadLang(app, ElementPlus)
  // 全局注册
  directives(app) // 指令
  registerIcons(app)
  return {
    app,
  };
}
