<script setup lang="ts">
import { PropType, ref, toRaw, watchEffect } from "vue"
import { settings } from "lingo3d"
import htmlContainer from "./logical/HTML/htmlContainer"

const props = defineProps({
  position: String as PropType<"absolute" | "relative" | "fixed">
})

const divRef = ref<HTMLDivElement>()

watchEffect((onCleanUp) => {
  const el = toRaw(divRef.value)
  if (!el) return

  el.appendChild(htmlContainer)
  settings.autoMount = el

  onCleanUp(() => {
    settings.autoMount = false
  })
})

const style = document.createElement("style")
style.innerHTML = `.lingo3d {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    display: flex;
}`
document.head.appendChild(style)
</script>

<template>
  <div class="lingo3d" :style="{ position: props.position }">
    <div style="height: 100%"><slot /></div>
    <div
      ref="divRef"
      style="height: 100%; flex-grow: 1; position: relative; overflow: hidden"
    />
  </div>
</template>
