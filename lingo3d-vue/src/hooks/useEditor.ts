import { onUnmounted, ref, toRaw, watchEffect } from "vue"
import { render, h as preactH } from "preact"
import "lingo3d/lib/editor"

export default (Component: any, props?: any) => {
  const divRef = ref<HTMLDivElement>()

  watchEffect(() => {
    const el = toRaw(divRef.value)
    if (!el) return

    render(preactH(Component, props && { ...props }), el)
  })

  onUnmounted(() => {
    const el = toRaw(divRef.value)
    if (!el) return

    render(undefined, el)
  })

  return divRef
}
