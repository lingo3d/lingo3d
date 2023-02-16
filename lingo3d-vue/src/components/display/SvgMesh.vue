<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { SvgMesh } from "lingo3d"
import useManager from "../../hooks/useManager"
import svgMeshProps from "../../props/svgMeshProps"

const props = defineProps(svgMeshProps)
const manager = useManager(props, SvgMesh)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
