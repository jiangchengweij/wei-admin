import { createSSRApp } from "vue"
import App from "./App.vue"
import initRouter from './router'
import { loadLang } from "./lang"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export function createApp() {
  const app = createSSRApp(App);
  setTimeout(async () => {
    await loadLang(app)
    //@ts-ignore
    initRouter(app.router)
  }, 0)
  app.use(ElementPlus)
  return {
    app,
  };
}
