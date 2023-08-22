import { createSSRApp } from "vue"
import App from "./App.vue"
import initRouter from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export function createApp() {
  const app = createSSRApp(App);
  app.use(ElementPlus)
  initRouter(app)
  return {
    app,
  };
}
