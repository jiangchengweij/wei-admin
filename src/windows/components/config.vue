<template>
  <div class="layout-config-drawer">
    <el-drawer 
      :model-value="config.layout.showDrawer"
      :title="t('layouts.Layout configuration')" size="310px"
      @close="onCloseDrawer"
    >
      <el-scrollbar class="layout-mode-style-scrollbar">
        <el-form ref="formRef" :model="config.layout">
          <div class="layout-mode-styles-box">
            <el-divider border-style="dashed">{{ t('layouts.Layout mode') }}</el-divider>
            <div class="layout-mode-box-style">
              <el-row class="layout-mode-box-style-row" :gutter="10">
                <el-col :span="12">
                  <div
                    @click="setLayoutMode('Default')"
                    class="layout-mode-style default"
                    :class="config.layout.layoutMode == 'Default' ? 'active' : ''"
                  >
                    <div class="layout-mode-style-box">
                      <div class="layout-mode-style-aside"></div>
                      <div class="layout-mode-style-container-box">
                        <div class="layout-mode-style-header"></div>
                        <div class="layout-mode-style-container"></div>
                      </div>
                    </div>
                    <div class="layout-mode-style-name">{{ t('layouts.default') }}</div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <el-divider border-style="dashed">{{ t('layouts.overall situation') }}</el-divider>
            <div class="layout-config-global">
              <el-form-item size="large" :label="t('layouts.Dark mode')">
                <DarkSwitch @click="toggleDark()" />
              </el-form-item>
              <el-form-item :label="t('layouts.Show Tabs')">
                <el-switch @change="onCommitState($event, 'navTab')" :model-value="config.layout.navTab"></el-switch>
              </el-form-item>
            </div>
            <el-divider border-style="dashed">{{ t('layouts.sidebar') }}</el-divider>
            <div class="layout-config-aside">
              <el-form-item :label="t('layouts.Side menu bar background color')">
                <el-color-picker @change="onCommitColorState($event, 'menuBackground')" :model-value="config.getColorVal('menuBackground')" />
              </el-form-item>
              <el-form-item :label="t('layouts.Side menu text color')">
                <el-color-picker @change="onCommitColorState($event, 'menuColor')" :model-value="config.getColorVal('menuColor')" />
              </el-form-item>
              <el-form-item :label="t('layouts.Side menu active item background color')">
                <el-color-picker
                  @change="onCommitColorState($event, 'menuActiveBackground')"
                  :model-value="config.getColorVal('menuActiveBackground')"
                />
              </el-form-item>
              <el-form-item :label="t('layouts.Side menu active item text color')">
                <el-color-picker @change="onCommitColorState($event, 'menuActiveColor')" :model-value="config.getColorVal('menuActiveColor')" />
              </el-form-item>
              <el-form-item :label="t('layouts.Show side menu top bar (logo bar)')">
                <el-switch @change="onCommitState($event, 'menuShowTopBar')" :model-value="config.layout.menuShowTopBar"></el-switch>
              </el-form-item>
              <el-form-item :label="t('layouts.Side menu top bar background color')">
                <el-color-picker
                  @change="onCommitColorState($event, 'menuTopBarBackground')"
                  :model-value="config.getColorVal('menuTopBarBackground')"
                />
              </el-form-item>
              <!-- <el-form-item :label="t('layouts.Side menu default icon')">
                <IconSelector @change="onCommitMenuDefaultIcon($event, 'menuDefaultIcon')" :model-value="configStore.layout.menuDefaultIcon" />
              </el-form-item> -->
              <el-form-item :label="t('layouts.Side menu horizontal collapse')">
                <el-switch @change="onCommitState($event, 'menuCollapse')" :model-value="config.layout.menuCollapse"></el-switch>
              </el-form-item>
              <el-form-item :label="t('layouts.Side menu accordion')">
                <el-switch @change="onCommitState($event, 'menuUniqueOpened')" :model-value="config.layout.menuUniqueOpened"></el-switch>
              </el-form-item>
            </div>

            <el-popconfirm
              @confirm="restoreDefault"
              :title="t('layouts.Are you sure you want to restore all configurations to the default values?')"
            >
              <template #reference>
                <div class="ba-center">
                  <el-button class="w80" type="info">{{ t('layouts.Restore default') }}</el-button>
                </div>
              </template>
            </el-popconfirm>
          </div>
        </el-form>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { useConfig } from '@/stores/config'
import { useI18n } from 'vue-i18n'
import { STORE_CONFIG, BEFORE_RESIZE_LAYOUT } from '/@/stores/constant/cacheKey'
import { Local, Session } from '/@/utils/storage'
import type { Layout } from '/@/stores/interface'
import DarkSwitch from './darkSwitch.vue'
import toggleDark from '/@/utils/useDark'

const { t } = useI18n()
const config = useConfig()

const onCommitState = (value: any, name: any) => {
  config.setLayout(name, value)
}

const onCommitColorState = (value: string | null, name: keyof Layout) => {
  if (value === null) return
  const colors = config.layout[name] as string[]
  if (config.layout.isDark) {
    colors[1] = value
  } else {
    colors[0] = value
  }
  config.setLayout(name, colors)
}
const setLayoutMode = (mode: string) => {
  Session.set(BEFORE_RESIZE_LAYOUT, {
    layoutMode: mode,
    menuCollapse: config.layout.menuCollapse,
  })
  config.setLayoutMode(mode)
}

const onCloseDrawer = () => {
  config.setLayout('showDrawer', false)
}

const restoreDefault = () => {
  Local.remove(STORE_CONFIG)
  Session.remove(BEFORE_RESIZE_LAYOUT)
  window.location.reload()
}
</script>
<style scoped lang="scss">
.layout-config-drawer :deep(.el-input__inner) {
  padding: 0 0 0 6px;
}
.layout-config-drawer :deep(.el-input-group__append) {
  padding: 0 10px;
}
.layout-config-drawer :deep(.el-drawer__header) {
  margin-bottom: 0 !important;
}
.layout-config-drawer :deep(.el-drawer__body) {
  padding: 0;
}
.layout-mode-styles-box {
  padding: 20px;
}
.layout-mode-box-style-row {
  margin-bottom: 15px;
}
.layout-mode-style {
  position: relative;
  height: 100px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-small);
  &:hover,
  &.active {
    border: 1px solid var(--el-color-primary);
  }
  .layout-mode-style-name {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-color-primary-light-5);
    border-radius: 50%;
    height: 50px;
    width: 50px;
    border: 1px solid var(--el-color-primary-light-3);
  }
  .layout-mode-style-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  &.default {
    display: flex;
    align-items: center;
    justify-content: center;
    .layout-mode-style-aside {
      width: 18%;
      height: 90%;
      background-color: var(--el-border-color-lighter);
    }
    .layout-mode-style-container-box {
      width: 68%;
      height: 90%;
      margin-left: 4%;
      .layout-mode-style-header {
        width: 100%;
        height: 10%;
        background-color: var(--el-border-color-lighter);
      }
      .layout-mode-style-container {
        width: 100%;
        height: 85%;
        background-color: var(--el-border-color-extra-light);
        margin-top: 5%;
      }
    }
  }
}
.w80 {
  width: 90%;
}
</style>
