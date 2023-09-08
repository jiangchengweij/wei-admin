<template>
  <div>
    <div @contextmenu.stop="" id="bubble" class="bubble">
      <canvas canvas-id="bubble-canvas" id="bubble-canvas" class="bubble-canvas"
        :style="{
          width: bubble.width.value +'px',
          height: bubble.height.value + 'px'
        }"></canvas>
    </div>
    <div class="login">
      <div class="login-box">
        <div class="head">
          <img src="~assets/login-header.png" alt="" />
        </div>
        <div class="form">
          <img class="profile-avatar" src="~assets/avatar.png" alt="" />
          <div class="content">
            <el-form @keyup.enter="onSubmitPre()" ref="formRef" :rules="rules" size="large" :model="form">
              <el-form-item prop="username">
                <el-input ref="usernameRef" type="text" clearable v-model="form.username" :placeholder="t('login.login-withpwd.Please enter an account')">
                  <template #prefix>
                    <wa-icon name="fa fa-user" class="form-item-icon" size="16" color="var(--el-input-icon-color)" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input ref="passwordRef" v-model="form.password" type="password" :placeholder="t('login.login-withpwd.Please input a password')" show-password>
                  <template #prefix>
                    <wa-icon name="fa fa-unlock-alt" class="form-item-icon" size="16" color="var(--el-input-icon-color)" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item class="form-item-captcha" prop="captcha" v-if="state.showCaptcha">
                <el-input v-model="form.captcha" type="text" :placeholder="t('login.login-withpwd.Please input a captcha')"></el-input>
                <div class="form-item-captcha__img-wrap" @click="setImageCaptcha">
                  <el-image 
                    class="form-item-captcha__img"
                    fit="cover"
                    :src="state.captchaBase64" 
                    v-loading="state.captchaLoading">
                  </el-image>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button :loading="state.submitLoading" class="submit-button" round type="primary" size="large" @click="onSubmitPre()">
                  {{ t('login.login-withpwd.Sign in') }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref, nextTick, onBeforeMount } from 'vue'
import { usePagePubble, removeListeners as bubbleRemoveListeners } from '/@/utils/pageBubble'
import type { FormInstance, InputInstance } from 'element-plus'
import { uuid } from '/@/utils/random'
import { buildValidatorData } from '/@/utils/validate'
import { useI18n } from 'vue-i18n'
import { ElNotification } from 'element-plus'
import { useCloud } from '@/cloud'
import { onLoad } from '@dcloudio/uni-app'
import { routePush } from '@/utils/router'
import adminConfig from '@/admin.config'

const $cloud = useCloud()

let timer: number

const formRef = ref<FormInstance>()
const usernameRef = ref<InputInstance>()
const passwordRef = ref<InputInstance>()

const state = reactive({
  showCaptcha: false,
  submitLoading: false,
  captchaBase64: '',
  captchaLoading: false
})
const form = reactive({
  username: '',
  password: '',
  keep: false,
  captchaId: uuid(),
  captchaInfo: '',
  captcha: '',
})


const { t } = useI18n()

const { bubble, init: bubbleInit } = usePagePubble()

// 表单验证规则
const rules = reactive({
  username: [buildValidatorData({ name: 'required', message: t('login.login-withpwd.Please enter an account') }), buildValidatorData({ name: 'account' })],
  password: [buildValidatorData({ name: 'required', message: t('login.login-withpwd.Please input a password') }), buildValidatorData({ name: 'password' })],
  captcha: [buildValidatorData({ name: 'required', message: t('login.login-withpwd.Please input a password') })],
})

const reactiveTo = ref<string>()

onLoad((params) => {
  if(params?.redirect) {
    reactiveTo.value = params.redirect
  }
})

onMounted(() => {
  timer = window.setTimeout(() => {
    bubbleInit()
  }, 1000)
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  bubbleRemoveListeners()
})

const onSubmitPre = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      onSubmit()
    }
  })
}

function onSubmit() {
  state.submitLoading = true
  let data: anyObj = {
    password: form.password,
    captcha: form.captcha
  }
  if (/^1\d{10}$/.test(form.username)) {
    data.mobile = form.username
  } else if (/@/.test(form.username)) {
    data.email = form.username
  } else {
    data.username = form.username
  }
  $cloud.uniIdCo.login(data).then((res) => {
    state.submitLoading = false
    ElNotification({
      message: '登录成功',
      type: 'success',
    })
    if(reactiveTo.value) {
      routePush(reactiveTo.value)
    } else {
      routePush(adminConfig.index?.url || '/')
    }
  }).catch((e: UniCloud.UniError) => {
    if(e.errCode === 'uni-id-captcha-required') {
      state.showCaptcha = true
      setImageCaptcha()
    } else {
      if(state.showCaptcha) setImageCaptcha()
    }
    state.submitLoading = false
  })
}

const uniCaptchaCo = uniCloud.importObject('uni-captcha-co', {
  customUI: true
})

function setImageCaptcha() {
  state.captchaLoading = true
  uniCaptchaCo.getImageCaptcha({
    scene: 'login-by-pwd'
  }).then((res: { captchaBase64: string }) => {
    state.captchaBase64 = res.captchaBase64
    state.captchaLoading = false
  }).catch((e: unknown) => {
    console.error(e)
    state.captchaLoading = false
  }) 
}
</script>
<style scoped lang="scss">
.switch-language {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1;
}
.bubble {
  overflow: hidden;
  background: url(/@/assets/bg.jpg) repeat;
}
.form-item-icon {
  height: auto;
}
.login {
  position: fixed;
  top: 0;
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  .login-box {
    overflow: hidden;
    width: 430px;
    padding: 0;
    background: var(--ba-bg-color-overlay);
    margin-bottom: 80px;
  }
  .head {
    background: #ccccff;
    img {
      display: block;
      width: 430px;
      margin: 0 auto;
      user-select: none;
    }
  }
  .form {
    position: relative;
    .profile-avatar {
      display: block;
      position: absolute;
      height: 100px;
      width: 100px;
      border-radius: 50%;
      border: 4px solid var(--ba-bg-color-overlay);
      top: -50px;
      right: calc(50% - 50px);
      z-index: 2;
      user-select: none;
    }
    .content {
      padding: 100px 40px 40px 40px;
    }
    .submit-button {
      width: 100%;
      letter-spacing: 2px;
      font-weight: 300;
      margin-top: 15px;
      --el-button-bg-color: var(--el-color-primary);
    }
    .form-item-captcha {
      &:deep(.el-form-item__content) {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
      }
      &__img {
        margin-left: 10px; 
        height: 40px;
        width: 120px;
        &-wrap {
          border-radius: 4px;
          overflow: hidden;
          display: inline-flex;
          cursor: pointer;
          flex-shrink: 0;
        }
      }
    }
  }
}

@media screen and (max-width: 720px) {
  .login {
    display: flex;
    align-items: center;
    justify-content: center;
    .login-box {
      width: 340px;
      margin-top: 0;
    }
  }
}
.chang-lang :deep(.el-dropdown-menu__item) {
  justify-content: center;
}
.content :deep(.el-input__prefix) {
  display: flex;
  align-items: center;
}

// 暗黑样式
@at-root .dark {
  .bubble {
    background: url(/@/assets/bg-dark.jpg) repeat;
  }
  .login {
    .login-box {
      background: #161b22;
    }
    .head {
      img {
        filter: brightness(61%);
      }
    }
    .form {
      .submit-button {
        --el-button-bg-color: var(--el-color-primary-light-5);
        --el-button-border-color: rgba(240, 252, 241, 0.1);
      }
    }
  }
}
@media screen and (max-height: 800px) {
  .login .login-box {
    margin-bottom: 0;
  }
}
</style>
