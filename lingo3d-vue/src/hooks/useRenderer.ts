import { getRenderer } from "lingo3d/lib/states/useRenderer"
import { onUnmounted, ref } from "vue"
import { WebGLRenderer } from "three"

export default () => {
    const renderer = ref<WebGLRenderer>()
    const handle = getRenderer(value => renderer.value = value)
    onUnmounted(() => {
        handle.cancel()
    })
    return renderer
}