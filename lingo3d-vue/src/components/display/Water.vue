<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { Water } from "lingo3d"
import useManager from "../../hooks/useManager"
import waterProps from "../../props/waterProps"

const props = defineProps(waterProps)
const manager = useManager(props, Water)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
