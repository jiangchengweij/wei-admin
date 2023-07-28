import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import type { I18n, Composer } from "vue-i18n"
import globsZhCn from './globs-zh-cn'
import globsEn from './globs-en'

/*
 * 默认只引入 element-plus 的中英文语言包
 * 其他语言包请自行在此 import,并添加到 assignLocale 内
 * 动态 import 只支持相对路径，所以无法按需 import element-plus 的语言包
 * 但i18n的 messages 内是按需载入的
 */
import elementZhcnLocale from 'element-plus/lib/locale/lang/zh-cn'
import elementEnLocale from 'element-plus/lib/locale/lang/en'

const assignLocale: anyObj = {
  'zh-cn': [elementZhcnLocale, globsZhCn],
  en: [elementEnLocale, globsEn]
}

export let i18n: {
  global: Composer
}

export function loadLang(app: App) {
  const locale = 'zh-cn';

  /*
  * 加载页面语言包 import.meta.glob 的路径不能使用变量 import() 在 Vite 中目录名不能使用变量(编译后,文件名可以)
  */
  if (locale == 'zh-cn') {
    assignLocale[locale].push(getLangFileMessage(import.meta.glob('./common/zh-cn/**/*.ts', { eager: true }), locale))
  } else if (locale == 'en') {
    assignLocale[locale].push(getLangFileMessage(import.meta.glob('./common/en/**/*.ts', { eager: true }), locale))
  }

  const messages = {
    [locale]: {}
  }

  // 合并语言包(含element-puls、页面语言包)
  Object.assign(messages[locale], ...assignLocale[locale])

  i18n = createI18n({
    locale: locale,
    legacy: false,
    globalInjection: true,
    messages
  })

  app.use(i18n as I18n)
  return i18n
}

function getLangFileMessage(mList: any, locale: string) {
  let msg: anyObj = {}
  locale = '/' + locale
  for (const path in mList) {
    if (mList[path].default) {
      // 获取文件名称
      const pathName = path.slice(path.lastIndexOf(locale) + (locale.length + 1), path.lastIndexOf('.'))
      if (pathName.indexOf('/') > 0) {
        
      } else {
        msg[pathName] = mList[path].default
      }
    }
  }
  return msg
}

export function handleMessage(msg: anyObj) {

}

export function mergeMsg(msg: anyObj, obj: anyObj) {

}

export function editDefaultLang(lang: string) {

}
