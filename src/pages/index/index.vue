<template>
  <div class="default-main">
    <h1>Hello App!</h1>
    <p>
      <!--使用 router-link 组件进行导航 -->
      <!--通过传递 `to` 来指定链接 -->
      <!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签-->
      <text>{{ adminInfo.username }}</text>
      <text>{{ adminInfo.nickname }}</text>
    </p>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue'
import { useRouter } from '@/router'
import uniDdRolesSchema from '@/uni_modules/uni-id-pages/uniCloud/database/uni-id-roles.schema.json'
import { useAdminInfo } from '@/stores/adminInfo'

const adminInfo = useAdminInfo()
const router = useRouter()
console.log(uniDdRolesSchema)
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
