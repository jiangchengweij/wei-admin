import { defineStore } from "pinia"
import { BA_ACCOUNT } from './constant/cacheKey'
import type { UserInfo } from './interface'
export const useBaAccount = defineStore('', {
  state: (): Partial<UserInfo> => {
    return {
      id: 0,
      username: '',
      nickname: '',
      email: '',
      mobile: '',
      avatar: '',
      gender: 0,
      birthday: '',
      money: 0,
      score: 0,
      motto: '',
      token: '',
      refresh_token: '',
    }
  },
  actions: {
    setToken(token: string, type: 'auth' | 'refresh') {
      const field = type == 'auth' ? 'token' : 'refresh_token'
      this[field] = token
    }
  },
  persist: {
    key: BA_ACCOUNT,
  }
})
