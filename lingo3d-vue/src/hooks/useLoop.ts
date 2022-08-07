import { loop } from "lingo3d"
import { ref, watchEffect } from "vue"

export default (cb: () => void, play = ref(true)) => {
  watchEffect((onCleanUp) => {
    if (!play.value) return

    const handle = loop(cb)

    onCleanUp(() => {
      handle.cancel()
    })
  })
}
