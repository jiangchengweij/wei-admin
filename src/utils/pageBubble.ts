// 页面气泡效果
import { ref } from 'vue'
import type { Ref } from 'vue'

const bubble: {
  width: Ref<number>
  height: Ref<number>
  bubbleEl: any
  ctx: any
  circles: any[]
  animate: boolean
  requestId: any
} = {
  width: ref(0),
  height: ref(0),
  bubbleEl: null,
  ctx: {},
  circles: [],
  animate: true,
  requestId: null,
}

export const usePagePubble = function () {
  return {
    init,
    bubble
  }
}

function init() {
  bubble.width.value = window.innerWidth
  bubble.height.value = window.innerHeight


  bubble.bubbleEl = document.getElementById('bubble')
  bubble.bubbleEl.style.height = bubble.height.value + 'px'

  bubble.ctx = uni.createCanvasContext('bubble-canvas')

  // create particles
  bubble.circles = []
  for (let x = 0; x < bubble.width.value * 0.5; x++) {
    const c = new Circle()
    bubble.circles.push(c)
  }
  animate()
  addListeners()
}

function scrollCheck() {
  bubble.animate = document.body.scrollTop > bubble.height.value ? false : true
}

function resize() {
  bubble.width.value = window.innerWidth
  bubble.height.value = window.innerHeight
  bubble.bubbleEl.style.height = bubble.height.value + 'px'
}

function animate() {
  if (bubble.animate) {
    bubble.ctx.clearRect(0, 0, bubble.width.value, bubble.height.value)
    for (const i in bubble.circles) {
      bubble.circles[i].draw()
    }
  }
  bubble.ctx.draw()
  bubble.requestId = requestAnimationFrame(animate)
}

class Circle {
  pos: {
    x: number
    y: number
  }
  alpha: number
  scale: number
  velocity: number
  draw: () => void
  constructor() {
    this.pos = {
      x: Math.random() * bubble.width.value,
      y: bubble.height.value + Math.random() * 100,
    }
    this.alpha = 0.1 + Math.random() * 0.3
    this.scale = 0.1 + Math.random() * 0.3
    this.velocity = Math.random()
    this.draw = function () {
      this.pos.y -= this.velocity
      this.alpha -= 0.0005
      bubble.ctx.beginPath()
      bubble.ctx.arc(this.pos.x, this.pos.y, this.scale * 10, 0, 2 * Math.PI, false)
      bubble.ctx.setFillStyle('rgba(255,255,255,' + this.alpha + ')')
      bubble.ctx.fill()
    }
  }
}

function addListeners() {
  window.addEventListener('scroll', scrollCheck)
  window.addEventListener('resize', resize)
}

export function removeListeners() {
  window.removeEventListener('scroll', scrollCheck)
  window.removeEventListener('resize', resize)
  cancelAnimationFrame(bubble.requestId)
}
