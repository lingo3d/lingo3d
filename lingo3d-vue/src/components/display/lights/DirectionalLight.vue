<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { DirectionalLight } from "lingo3d"
import useManager from "../../../hooks/useManager"
import directionalLightProps from "../../../props/directionalLightProps"

const props = defineProps(directionalLightProps)
const manager = useManager(props, DirectionalLight)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
