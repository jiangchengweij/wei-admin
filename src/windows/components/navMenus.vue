<template>
  <div class="nav-menus">
    <navigator url="/" open-type="reLaunch" class="h100">
      <div class="nav-menu-item">
        <wa-icon :color="config.getColorVal('headerBarTabColor')" class="nav-menu-icon" name="el-icon-Monitor" size="18" />
      </div>
    </navigator>
    <el-dropdown
      @visible-change="onCurrentNavMenu($event, 'lang')"
      class="h100"
      size="large"
      :hide-timeout="50"
      placement="bottom"
      trigger="click"
      :hide-on-click="true"
    >
      <div 
        class="nav-menu-item pt2" 
        :class="state.currentNavMenu == 'lang' ? 'hover' : ''">
        <wa-icon :color="config.getColorVal('headerBarTabColor')" class="nav-menu-icon" name="local-lang" size="18" />
      </div>
      <template #dropdown>
        <el-dropdown-menu class="dropdown-menu-box">
          <el-dropdown-item v-for="item in config.lang.langArray" :key="item.name" @click="editDefaultLang(item.name)">
              {{ item.value }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div 
      @click="onFullScreen" 
      class="nav-menu-item" 
      :class="state.isFullScreen ? 'hover' : ''"
    >
      <wa-icon :color="config.getColorVal('headerBarTabColor')" class="nav-menu-icon" name="el-icon-FullScreen" size="18" />
    </div>
    <el-dropdown
      v-if="adminInfo.super"
      class="h100"
      size="large"
      :hide-timeout="50"
      placement="bottom"
      trigger="click"
      :hide-on-click="true"
    >
      <div class="nav-menu-item" :class="state.currentNavMenu == 'clear' ? 'hover' : ''">
        <wa-icon 
          :color="config.getColorVal('headerBarTabColor')"
          class="nav-menu-icon" name="el-icon-Delete" size="18"
        />
      </div>
      <template #dropdown>
        <el-dropdown-menu class="dropdown-menu-box">
          <el-dropdown-item @click="onClearCache('tp')">{{ t('utils.Clean up system cache') }}</el-dropdown-item>
          <el-dropdown-item @click="onClearCache('storage')">{{ t('utils.Clean up browser cache') }}</el-dropdown-item>
          <el-dropdown-item @click="onClearCache('all')" divided>{{ t('utils.Clean up all cache') }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown
      v-if="adminInfo.super"
      class="h100"
      size="large"
      :hide-timeout="50"
      placement="bottom"
      trigger="click"
      :hide-on-click="true"
    >
      <div class="admin-info" :class="state.currentNavMenu == 'adminInfo' ? 'hover' : ''">
        <el-avatar :size="25" fit="fill">
          <img src="~assets/avatar.png" alt="avatar">
        </el-avatar>
        <div class="admin-name">{{ adminInfo.nickname }}</div>
      </div>
      <template #dropdown>
        <el-dropdown-item>{{ t('layouts.personal data') }}</el-dropdown-item>
        <el-dropdown-item>{{ t('layouts.cancellation') }}</el-dropdown-item>
      </template>
    </el-dropdown>
    <div @click="config.setLayout('showDrawer', true)" class="nav-menu-item">
      <wa-icon :color="config.getColorVal('headerBarTabColor')" class="nav-menu-icon" name="fa fa-cogs" size="18" />
    </div>
    <Config />
  </div>
</template>
<script setup lang="ts">
import { useAdminInfo } from '@/stores/adminInfo'
import { editDefaultLang } from '/@/lang'
import { useConfig } from '@/stores/config'
import { useI18n } from 'vue-i18n'
import { reactive } from 'vue'
import screenfull from 'screenfull'
import Config from './config.vue'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const adminInfo = useAdminInfo()
const config = useConfig()

const state = reactive({
  isFullScreen: false,
  currentNavMenu: '',
  showLayoutDrawer: false,
})

const onCurrentNavMenu = (status: boolean, name: string) => {
  state.currentNavMenu = status ? name : ''
}

const onFullScreen = () => {
  if (!screenfull.isEnabled) {
    ElMessage.warning(t('layouts.Full screen is not supported'))
    return false
  }
  screenfull.toggle()
  screenfull.onchange(() => {
    state.isFullScreen = screenfull.isFullscreen
  })
}

function onClearCache(type: string) {
  
}
</script>
<style scoped lang="scss">
.nav-menus {
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: auto;
  background-color: v-bind('config.getColorVal("headerBarBackground")');
  .nav-menu-item {
    height: 100%;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .nav-menu-icon {
      box-sizing: content-box;
      color: v-bind('config.getColorVal("headerBarTabColor")');
    }
    &:hover {
      .icon {
        animation: twinkle 0.3s ease-in-out;
      }
    }
  }
  .admin-info {
    display: flex;
    height: 100%;
    padding: 0 10px;
    align-items: center;
    cursor: pointer;
    user-select: none;
    color: v-bind('config.getColorVal("headerBarTabColor")');
  }
  .admin-name {
    padding-left: 6px;
    white-space: nowrap;
  }
  .nav-menu-item:hover,
  .admin-info:hover,
  .nav-menu-item.hover,
  .admin-info.hover {
    background: v-bind('config.getColorVal("headerBarHoverBackground")');
  }
}

@keyframes twinkle {
  0% {
    transform: scale(0);
  }
  80% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
