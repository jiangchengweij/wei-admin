<template>
  <div>13123123</div>
</template>
<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useRouter } from 'vue-router'
import Test from './pages/test/test.vue'
const router = useRouter();
router.addRoute({ path: '/test', component: Test })
router.options.history.destroy()
</script>
<style></style>
