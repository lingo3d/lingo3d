import { Mouse } from "lingo3d"
import { onUnmounted, reactive } from "vue"

export default () => {
  const status = reactive({ isDown: false })
  const mouse = new Mouse()

  mouse.onMouseDown = () => {
    status.isDown = true
  }
  mouse.onMouseUp = () => {
    status.isDown = false
  }

  onUnmounted(() => {
    mouse.dispose()
  })

  return status
}
