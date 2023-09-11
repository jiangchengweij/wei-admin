<template>
  <div class="default-main">
    <el-button @click="onTestActionRouter">action-router</el-button>
    <el-button @click="onTestActionInitRouter">action-router-init</el-button>
  </div>
</template>
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { useCloud } from '@/cloud'

const $cloud = useCloud()

onLoad(() => {
  console.log('demo3 load')
})

function onTestActionRouter() {
  $cloud.adminRouter('menu/index', { msg: 'nihao' })
}

function onTestActionInitRouter() {
  $cloud.adminRouter('main/init')
}
</script>
