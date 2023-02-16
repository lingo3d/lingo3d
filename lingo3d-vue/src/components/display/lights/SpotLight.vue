<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { SpotLight } from "lingo3d"
import useManager from "../../../hooks/useManager"
import spotLightProps from "../../../props/spotLightProps"

const props = defineProps(spotLightProps)
const manager = useManager(props, SpotLight)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
