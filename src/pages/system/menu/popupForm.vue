<template>
  <el-dialog
    class="wa-operate-dialog"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :model-value="['Add', 'Edit'].includes(waTableIns.form.operate!)"
    @close="waTableIns.toggleForm"
  >
    <template #header>
      <div class="title" v-drag="['.wa-operate-dialog', '.el-dialog__header']" v-zoom="'.wa-operate-dialog'">
        {{ waTableIns.form.operate ? t(waTableIns.form.operate) : '' }}
      </div>
    </template>
    <el-scrollbar v-loading="waTableIns.form.loading" class="wa-table-form-scrollbar">
      <div
        class="wa-operate-form"
        :class="'wa-' + waTableIns.form.operate + '-form'"
        :style="'width: calc(100% - ' + waTableIns.form.labelWidth! / 2 + 'px)'"
      >
        <el-form
          ref="formRef"
          @keyup.enter="waTableIns.onSubmit(formRef)"
          :model="waTableIns.form.items"
          label-position="right"
          :label-width="waTableIns.form.labelWidth + 'px'"
          :rules="rules"
          v-if="!waTableIns.form.loading"
        >
          <wa-form-item
            type="remoteSelect"
            prop="pid"
            :label="t('system.menu.Superior menu rule')"
            v-model="waTableIns.form.items!.pid"
            :placeholder="t('Click select')"
            :input-attr="{
              params: { isTree: true },
              field: 'title',
              actionUrl: waTableIns.router.actionUrl.get('index'),
            }"
          />
          <wa-form-item
            :label="t('system.menu.Rule type')"
            v-model="waTableIns.form.items!.type"
            type="radio"
            :data="{
              content: { menu_dir: t('system.menu.type menu_dir'), menu: t('system.menu.type menu'), button: t('system.menu.type button') },
              childrenAttr: { border: true },
            }"
          />

          <el-form-item prop="title" :label="t('system.menu.Rule title')">
            <el-input
              v-model="waTableIns.form.items!.title"
              type="string"
              :placeholder="t('Please input field', { field: t('system.menu.Rule title') })"
            ></el-input>
          </el-form-item>

          <el-form-item prop="name" :label="t('system.menu.Rule name')">
            <el-input
              v-model="waTableIns.form.items!.name"
              type="string"
              :placeholder="t('system.menu.English name, which does not need to start with `/admin`, such as auth/menu')"
            ></el-input>
            <div class="block-help">
              {{ t('system.menu.It will be registered as the web side routing name and used as the server side API authentication') }}
            </div>
          </el-form-item>

          <el-form-item v-if="waTableIns.form.items!.type != 'button'" :label="t('system.menu.Routing path')">
            <el-input
              v-model="waTableIns.form.items!.path"
              type="string"
              :placeholder="t('system.menu.The web side routing path (path) does not need to start with `/admin`, such as auth/menu')"
            ></el-input>
          </el-form-item>

          <wa-form-item
            v-if="waTableIns.form.operate && waTableIns.form.items!.type != 'button'"
            type="icon"
            :label="t('system.menu.Rule Icon')"
            v-model="waTableIns.form.items!.icon"
            :input-attr="{ 'show-icon-name': true }"
          />

          <wa-form-item
            v-if="waTableIns.form.items!.type == 'menu'"
            :label="t('system.menu.Menu type')"
            v-model="waTableIns.form.items!.menu_type"
            type="radio"
            :data="{
              content: { tab: t('system.menu.Menu type tab'), link: t('system.menu.Menu type link (offsite)'), iframe: 'Iframe' },
              childrenAttr: { border: true },
            }"
          />

          <el-form-item
            prop="url"
            v-if="waTableIns.form.items!.menu_type != 'tab' && waTableIns.form.items!.type != 'button'"
            :label="t('system.menu.Link address')"
          >
            <el-input
              v-model="waTableIns.form.items!.url"
              type="string"
              :placeholder="t('system.menu.Please enter the URL address of the link or iframe')"
            ></el-input>
          </el-form-item>

          <el-form-item
            v-if="waTableIns.form.items!.type == 'menu' && waTableIns.form.items!.menu_type == 'tab'"
            :label="t('system.menu.Extended properties')"
          >
            <el-select
              class="w100"
              v-model="waTableIns.form.items!.extend"
              :placeholder="t('Please select field', { field: t('system.menu.Extended properties') })"
            >
              <el-option :label="t('system.menu.none')" value="none"></el-option>
              <el-option :label="t('system.menu.Add as route only')" value="add_rules_only"></el-option>
              <el-option :label="t('system.menu.Add as menu only')" value="add_menu_only"></el-option>
            </el-select>
            <div class="block-help">{{ t('system.menu.extend Title') }}</div>
          </el-form-item>

          <el-form-item :label="t('system.menu.Rule comments')">
            <el-input
              @keyup.enter.stop=""
              @keyup.ctrl.enter="waTableIns.onSubmit(formRef)"
              v-model="waTableIns.form.items!.remark"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              :placeholder="
                t(
                  'system.menu.Use in controller `get_ route_ Remark()` function, which can obtain the value of this field for your own use, such as the banner file of the console'
                )
              "
            ></el-input>
          </el-form-item>
          <el-form-item :label="t('system.menu.Rule weight')">
            <el-input
              v-model="waTableIns.form.items!.weigh"
              type="number"
              :placeholder="t('system.menu.Please enter the weight of menu rule (sort by)')"
            ></el-input>
          </el-form-item>
          <wa-form-item
            :label="t('State')"
            v-model="waTableIns.form.items!.status"
            type="radio"
            :data="{
              content: { '0': t('Disable'), '1': t('Enable') },
              childrenAttr: { border: true },
            }"
          />
        </el-form>
      </div>
    </el-scrollbar>
    <template #footer>
      <div :style="'width: calc(100% - ' + waTableIns.form.labelWidth! / 1.8 + 'px)'">
        <el-button @click="waTableIns.toggleForm('')">{{ t('Cancel') }}</el-button>
        <el-button v-blur :loading="waTableIns.form.submitLoading" @click="waTableIns.onSubmit(formRef)" type="primary">
          {{ waTableIns.form.operateIds && waTableIns.form.operateIds.length > 1 ? t('Save and edit next item') : t('Save') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import type waTableClass from '/@/utils/waTable'
import { buildValidatorData } from '/@/utils/validate'
import type { FormInstance, FormItemRule } from 'element-plus'

const formRef = ref<FormInstance>()
const waTableIns = inject('waTable') as waTableClass

const { t } = useI18n()

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
  title: [buildValidatorData({ name: 'required', title: t('system.menu.Rule title') })],
  name: [buildValidatorData({ name: 'required', title: t('system.menu.Rule name') })],
  url: [buildValidatorData({ name: 'url', message: t('system.menu.Please enter the correct URL') })],
  pid: [
    {
      validator: (rule: any, val: string, callback: Function) => {
        if (!val) {
          return callback()
        }
        if (parseInt(val) == parseInt(waTableIns.form.items!.id)) {
          return callback(new Error(t('system.menu.The superior menu rule cannot be the rule itself')))
        }
        return callback()
      },
      trigger: 'blur',
    },
  ],
})
</script>
