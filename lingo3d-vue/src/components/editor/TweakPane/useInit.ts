import { ref, toRaw, watchEffect } from "vue"

export default () => {
  const elRef = ref<HTMLDivElement>()

  watchEffect((cleanup) => {
    const el = toRaw(elRef.value)
    if (!el) return

    const stop = (e: Event) => e.stopPropagation()

    el.addEventListener("mousedown", stop)
    el.addEventListener("pointerdown", stop)
    el.addEventListener("touchstart", stop)
    el.addEventListener("keydown", stop)

    cleanup(() => {
      el.removeEventListener("mousedown", stop)
      el.removeEventListener("pointerdown", stop)
      el.removeEventListener("touchstart", stop)
      el.removeEventListener("keydown", stop)
    })
  })

  return elRef
}
