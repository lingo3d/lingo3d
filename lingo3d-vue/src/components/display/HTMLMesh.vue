<script setup lang="ts">
import { HTMLMesh } from "lingo3d"
import { ref, toRaw, watchEffect } from "vue"
import useManager from "../../hooks/useManager"
import htmlMeshProps from "../../props/htmlMeshProps"

const props = defineProps(htmlMeshProps)
const manager = useManager(props, HTMLMesh)
defineExpose(manager)

const divRef = ref<HTMLDivElement>()
watchEffect(() => {
  manager.element = toRaw(divRef.value)
})
</script>

<template>
  <div ref="divRef">
    <slot />
  </div>
</template>
