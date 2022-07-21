<script setup lang="ts">
import { ref, toRaw, watchEffect } from "vue"
import Group from "../display/Group.vue"
import { clientToWorld, Group as LingoGroup, onBeforeRender } from "lingo3d"

const props = defineProps({
  distance: {
    type: Number,
    default: 500
  }
})

const elRef = ref<HTMLDivElement>()
const groupRef = ref<LingoGroup>()

watchEffect((cleanup) => {
  const el = toRaw(elRef.value)
  const group = toRaw(groupRef.value)
  if (!el || !group) return

  const { distance } = props

  const handle = onBeforeRender(() => {
    const { left, top, width, height } = el.getBoundingClientRect()
    const clientX = left + width * 0.5
    const clientY = top + height * 0.5
    group.placeAt(clientToWorld(clientX, clientY, distance))
  })
  cleanup(() => {
    handle.cancel()
  })
})
</script>

<template>
  <div ref="elRef">
    <Group ref="groupRef">
      <slot />
    </Group>
  </div>
</template>
