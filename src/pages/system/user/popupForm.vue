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
          <el-form-item prop="permission_id" label="权限标识">
            <el-input
                v-model="waTableIns.form.items!.permission_id"
                type="string"
                placeholder="请输入权限标识，不可重复"
            ></el-input>
          </el-form-item>
          <el-form-item prop="permission_name" label="权限名称">
            <el-input
                v-model="waTableIns.form.items!.permission_name"
                type="string"
                placeholder="请输入权限名称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="comment" label="备注">
            <el-input
                v-model="waTableIns.form.items!.comment"
                type="textarea"
                placeholder="请输入备注"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-scrollbar>
    <template #footer>
      <div :style="'width: calc(100% - ' + waTableIns.form.labelWidth! / 1.8 + 'px)'">
          <el-button @click="waTableIns.toggleForm('')">{{ t('Cancel') }}</el-button>
          <el-button v-blur :loading="waTableIns.form.submitLoading" 
            @click="waTableIns.onSubmit(formRef)" type="primary"
          >
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
  permission_id: [buildValidatorData({ name: 'required', title:  '必须填写权限标识'})],
  permission_name: [buildValidatorData({ name: 'required', title: '必须填写权限名称' })],
})
</script>
