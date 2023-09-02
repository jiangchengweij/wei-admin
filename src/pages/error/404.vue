<template>
  <div class="page">
    <div class="container">
      <div class="font-h1">:(</div>
      <div class="tip" @click="onBack">{{ $t('404.problems tip') }}</div>
      <div class="details">
        <div class="stopcode">
          <div class="stopcode-text">
            <navigator class="stopcode-a" url="/">{{ $t('404.Return to home page') }}</navigator>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const complete = ref(0)
var timer: any = null

var pages = getCurrentPages();

function process() {
  complete.value += Math.floor(Math.random() * 50)
  if (complete.value >= 100) {
    complete.value = 100
    uni.navigateBack()
  } else {
    processInterval()
  }
}

function onBack() {
  uni.navigateBack()
}

function processInterval() {
  timer = setTimeout(process, Math.random() * (1000 - 500) + 500)
}

onMounted(() => {
  //processInterval()
})
onBeforeUnmount(() => {
  //clearTimeout(timer)
})
</script>

<style scoped lang="scss">
.page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  .container {
    width: 50%;
    .font-h1 {
      font-size: 120px;
    }
    .tip {
      font-size: 30px;
      padding-top: 20px;
    }
    .complete {
      font-size: 30px;
      padding: 30px 0;
    }
    .details {
      display: flex;
      align-items: center;
      .qr-image img {
        height: 80px;
        width: 80px;
      }
      .stopcode {
        padding-left: 10px;
        .stopcode-text {
          display: block;
          padding: 4px 0;
          font-size: 16px;
        }
      }
    }
  }
}

@media screen and (max-width: 720px) {
  .container {
    width: 90vw !important;
  }
  .tip {
    font-size: 20px !important;
    padding-top: 20px;
  }
  .complete {
    font-size: 20px !important;
    padding: 30px 0;
  }
  .stopcode-text {
    font-size: 15px !important;
  }
}
</style>
