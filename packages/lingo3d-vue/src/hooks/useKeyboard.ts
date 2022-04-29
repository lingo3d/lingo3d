import { Keyboard } from "lingo3d"
import { isPressed } from "lingo3d/lib/api/keyboard"
import { onUnmounted, ref } from "vue"

export default (cb?: (key: string) => void) => {
    const keysRef = ref("")

    const keyboard = new Keyboard()
    let latestKey = ""

    keyboard.onKeyDown = k => {
        if (latestKey === k) return
        latestKey = k
        keysRef.value = [...isPressed].join(" ")
    }

    keyboard.onKeyUp = () => {
        latestKey = ""
        keysRef.value = [...isPressed].join(" ")
    }

    keyboard.onKeyPress = cb
    
    onUnmounted(() => {
        keyboard.dispose()
    })

    return keysRef
}