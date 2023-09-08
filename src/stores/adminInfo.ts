import { defineStore } from 'pinia'
import type { AdminInfo } from '/@/stores/interface'
import { useCloud } from '@/cloud'
import { useNavTabs } from './navTabs'

export const useAdminInfo = defineStore('adminInfo', {
  state: (): AdminInfo => {
    return {
      id: 0,
      username: '',
      nickname: '',
      last_login_date: '',
      token: null,
      hasInitAdminInfo: false,
      role: [],
      super: false,
    }
  },
  actions: {
    dataFill(state: AdminInfo) {
      this.$state = { ...this.$state, ...state }
    },
    setToken(token: string) {
      this.token = token
    },
    removeToken() {
      uni.removeStorageSync('uni_id_token')
      uni.removeStorageSync('uni_id_token_expired')
      this.token = null
    },
    getToken() {
      if(this.token) {
        return this.token
      }
      const tokenExpired = uni.getStorageSync('uni_id_token_expired')
      const now = Date.now()
      if(now > tokenExpired) {
        return null
      }
      return uni.getStorageSync("uni_id_token")
    },
    async initAdminInfo() {
      const navTabs = useNavTabs()
      const $cloud = useCloud()
      try {
        const { menus, adminInfo } = await $cloud.adminRouter('main/init')
        navTabs.setTabsViewRoutes(menus)
        this.dataFill(adminInfo)
        if(this.role.includes('admin')) {
          this.super = true
        }
        this.hasInitAdminInfo = true
      } catch(e) {
        this.removeToken()
      }
    }
  },
})
