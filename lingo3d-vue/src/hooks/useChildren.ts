import { Model } from "lingo3d"
import FoundManager from "lingo3d/lib/display/core/FoundManager"
import Loaded from "lingo3d/lib/display/core/Loaded"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { ref, Ref, toRaw, watchEffect } from "vue"

export default (
  parentRef: Ref<ObjectManager | Model | Loaded | undefined>,
  name?: string | RegExp
) => {
  const foundRef = ref<Array<FoundManager>>([])

  watchEffect((onCleanUp) => {
    const parent = toRaw(parentRef?.value)
    if (!parent) return

    if ("loaded" in parent) {
      const handle = parent.loaded.then(() => {
        foundRef.value = parent.findAll(name)
      })
      return onCleanUp(() => {
        handle.cancel()
      })
    }
    foundRef.value = parent.findAll(name)
  })
  return foundRef
}
