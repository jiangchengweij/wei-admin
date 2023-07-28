import type { Router } from 'vue-router'

function initRouter(router: Router) {
  router.beforeEach((to, from, next) => {
    console.log(to)
    console.log(from)
    next()
  })
}

export default initRouter
