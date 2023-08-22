<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(async () => {
  const wait = () => {
    return new Promise((resolve, _) => {
      setTimeout(() => {
        resolve(null)
      }, 2000)
    })
  }
  await wait()
})
</script>
<style></style>
