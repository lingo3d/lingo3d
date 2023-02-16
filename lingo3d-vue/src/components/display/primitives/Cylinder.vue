<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { Cylinder } from "lingo3d"
import useManager from "../../../hooks/useManager"
import primitiveProps from "../../../props/primitiveProps"

const props = defineProps(primitiveProps)
const manager = useManager(props, Cylinder)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
