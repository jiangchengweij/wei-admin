import { createSSRApp } from "vue"
import App from "./App.vue"
import initRouter from './router'
import ElementPlus from 'element-plus'
import pinia from "./stores"
import { loadLang } from '/@/lang/index'
import 'element-plus/dist/index.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import '/@/styles/index.scss'

export function createApp() {
  const app = createSSRApp(App)
  initRouter(app)
  app.use(pinia)
  loadLang(app)
  app.use(ElementPlus)
  return {
    app,
  };
}
