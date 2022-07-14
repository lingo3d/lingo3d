<script setup lang="ts">
import { onAfterRender } from "lingo3d"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { inject, Ref, ref, toRaw, watchEffect } from "vue"
import htmlContainer from "./htmlContainer"

const divRef = ref<HTMLDivElement>()
const parentRef = inject<Ref<ObjectManager> | undefined>("parent", undefined)

watchEffect((cleanUp) => {
  const div = toRaw(divRef.value)
  const parent = toRaw(parentRef?.value)
  if (!div || !parent) return

  let frustumVisibleOld = false

  const handle = onAfterRender(() => {
    const { frustumVisible } = parent

    if (frustumVisible !== frustumVisibleOld)
      div.style.display = frustumVisible ? "block" : "none"

    frustumVisibleOld = frustumVisible

    if (!frustumVisible) return

    div.style.transform = `translateX(${parent.clientX}px) translateY(${parent.clientY}px)`
  })
  cleanUp(() => {
    handle.cancel()
  })
})
</script>

<template>
  <Teleport :to="htmlContainer">
    <div ref="divRef" style="display: none">
      <slot />
    </div>
  </Teleport>
</template>
