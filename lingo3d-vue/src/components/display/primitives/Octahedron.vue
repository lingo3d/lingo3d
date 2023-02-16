<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { Octahedron } from "lingo3d"
import useManager from "../../../hooks/useManager"
import primitiveProps from "../../../props/primitiveProps"

const props = defineProps(primitiveProps)
const manager = useManager(props, Octahedron)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
