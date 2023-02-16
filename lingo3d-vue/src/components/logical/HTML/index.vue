<script setup lang="ts">
import { onAfterRender } from "lingo3d"
import VisibleObjectManager from "lingo3d/lib/display/core/VisibleObjectManager"
import { inject, Ref, ref, toRaw, watchEffect } from "vue"
import htmlContainer from "./htmlContainer"

const divRef = ref<HTMLDivElement>()
const parentRef = inject<Ref<VisibleObjectManager> | undefined>(
  "parent",
  undefined
)

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

    div.style.transform = `translateX(${parent.canvasX}px) translateY(${parent.canvasY}px)`
  })
  cleanUp(() => {
    handle.cancel()
  })
})
</script>

<template>
  <Teleport :to="htmlContainer">
    <div ref="divRef" style="display: none">
      <div
        style="
          position: absolute;
          transform: translateX(-50%) translateY(-50%);
          left: 0px;
          top: 0px;
        "
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
