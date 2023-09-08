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
            prop="parent_id"
            label="父级菜单"
            v-model="waTableIns.form.items!.parent_id"
            placeholder="新增菜单时自动填充, 一级菜单不需要填写"
            :input-attr="{
              pk: 'menu_id',
              field: 'name, menu_id, sort',
              collection: 'opendb-admin-menus',
              gettree: true,
              keywordKey: 'name',
              orderby: 'sort asc'
            }"
          ></wa-form-item>
          <el-form-item prop="menu_id" label="标识">
            <el-input
                v-model="waTableIns.form.items!.menu_id"
                type="string"
                placeholder="请输入菜单项的ID，不可重复"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="显示名称">
            <el-input
                v-model="waTableIns.form.items!.name"
                type="string"
                placeholder="请输入菜单名称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="url" label="页面路径">
            <el-input
                v-model="waTableIns.form.items!.url"
                type="string"
                placeholder="路径为空代表是目录而不是叶子节点"
            ></el-input>
          </el-form-item>
          <wa-form-item
            type="icon"
            label="图标"
            v-model="waTableIns.form.items!.icon"
            :input-attr="{ 'show-icon-name': true }"
          />
          <wa-form-item
            type="remoteSelect"
            prop="permission"
            label="权限列表"
            v-model="waTableIns.form.items!.permission"
            placeholder="填写权限列表"
            :input-attr="{
              pk: 'permission_id',
              labelField: 'permission_name',
              field: 'permission_name, permission_id, parent_id',
              collection: 'uni-id-permissions',
              keywordKey: 'permission_name',
              orderby: 'permission_id asc',
              multiple: true,
            }"
          ></wa-form-item>
          <el-form-item prop="sort" label="序号">
            <el-input
                v-model="waTableIns.form.items!.sort"
                type="string"
                placeholder="请输入菜单序号（越大越靠后）"
            ></el-input>
          </el-form-item>
          <wa-form-item
            label="状态"
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
  name: [buildValidatorData({ name: 'required', title:  '菜单名称'})],
  menu_id: [buildValidatorData({ name: 'required', title: '唯一标识' })],
  sort: [buildValidatorData({ name: 'number', title: '序号必须为数字' })],
})
</script>
