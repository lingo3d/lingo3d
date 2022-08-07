import { getRenderer } from "lingo3d/lib/states/useRenderer"
import { onUnmounted, ref } from "vue"

export default () => {
  const renderer = ref(getRenderer())
  const handle = getRenderer((value) => (renderer.value = value))
  onUnmounted(() => {
    handle.cancel()
  })
  return renderer
}
