<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { Tetrahedron } from "lingo3d"
import useManager from "../../../hooks/useManager"
import primitiveProps from "../../../props/primitiveProps"

const props = defineProps(primitiveProps)
const manager = useManager(props, Tetrahedron)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
