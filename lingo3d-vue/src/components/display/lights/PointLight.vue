<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { PointLight } from "lingo3d"
import useManager from "../../../hooks/useManager"
import pointLightProps from "../../../props/pointLightProps"

const props = defineProps(pointLightProps)
const manager = useManager(props, PointLight)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
