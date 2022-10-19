<script setup lang="ts">
import { PropType, ref, toRaw, watchEffect } from "vue"
import { onBeforeRender, onAfterRender } from "lingo3d"
import StatsJS from "stats.js"

const props = defineProps({
  mode: {
    type: String as PropType<"fps" | "time" | "memory">,
    default: "fps"
  }
})
const divRef = ref<HTMLDivElement>()

watchEffect((cleanup) => {
  const div = toRaw(divRef.value)
  if (!div) return

  const stats = new StatsJS()
  stats.showPanel(props.mode === "fps" ? 0 : props.mode === "time" ? 1 : 2)
  div.appendChild(stats.dom)

  const beforeHandle = onBeforeRender(() => stats.begin())
  const afterHandle = onAfterRender(() => stats.end())

  cleanup(() => {
    beforeHandle.cancel()
    afterHandle.cancel()
  })
})
</script>

<template>
  <div ref="divRef" />
</template>
