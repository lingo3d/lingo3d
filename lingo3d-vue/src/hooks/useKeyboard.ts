import { Keyboard } from "lingo3d"
import { LingoKeyboardEvent } from "lingo3d/lib/interface/IKeyboard"
import { onUnmounted, ref } from "vue"

export default (cb?: (e: LingoKeyboardEvent) => void) => {
  const keysRef = ref("")

  const keyboard = new Keyboard()
  let latestKey = ""

  keyboard.onKeyDown = (e) => {
    if (latestKey === e.key) return
    latestKey = e.key
    keysRef.value = [...e.keys].join(" ")
  }

  keyboard.onKeyUp = (e) => {
    latestKey = ""
    keysRef.value = [...e.keys].join(" ")
  }

  keyboard.onKeyPress = cb

  onUnmounted(() => {
    keyboard.dispose()
  })

  return keysRef
}
