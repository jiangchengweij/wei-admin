<template>
  <div>
    <div
      v-loading="true"
      element-loading-background="var(--ba-bg-color-overlay)"
      :element-loading-text="$t('utils.Loading')"
      class="default-main ba-main-loading"
    ></div>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped lang="scss">
.ba-main-loading {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
