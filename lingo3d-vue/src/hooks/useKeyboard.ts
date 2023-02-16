import { Keyboard } from "lingo3d"
import { isPressed } from "lingo3d/lib/api/keyboard"
import { LingoKeyboardEvent } from "lingo3d/lib/interface/IKeyboard"
import { onUnmounted, ref } from "vue"

export default (cb?: (e: LingoKeyboardEvent) => void) => {
  const keysRef = ref("")

  const keyboard = new Keyboard()
  let latestKey = ""

  keyboard.onKeyDown = (e) => {
    if (latestKey === e.key) return
    latestKey = e.key
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
