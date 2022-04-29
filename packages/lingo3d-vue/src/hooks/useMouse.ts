import { Mouse } from "lingo3d"
import { onUnmounted, reactive } from "vue"

export default () => {
    const status = reactive({ x: 0, y: 0, isDown: false })
    const mouse = new Mouse()

    mouse.onMouseMove = () => {
        status.x = mouse.x
        status.y = mouse.y
    }
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