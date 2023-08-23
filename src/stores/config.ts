import { reactive } from 'vue'
import { defineStore } from "pinia"

export const useConfig = defineStore(
  'config',
  () => {
    const lang = reactive({
      // 默认语言，可选值<zh-cn|en>
      defaultLang: 'zh-cn',
      // 当在默认语言包找不到翻译时，继续在 fallbackLang 语言包内查找翻译
      fallbackLang: 'zh-cn',
      // 支持的语言列表
      langArray: [
        { name: 'zh-cn', value: '中文简体' },
        { name: 'en', value: 'English' },
      ],
    })

    function setLang(val: string) {
      lang.defaultLang = val
    }

    return { lang, setLang }
  }
)
