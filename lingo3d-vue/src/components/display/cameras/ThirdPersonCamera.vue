<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { ThirdPersonCamera } from "lingo3d"
import useManager from "../../../hooks/useManager"
import thirdPersonCameraProps from "../../../props/thirdPersonCameraProps"

const props = defineProps(thirdPersonCameraProps)
const manager = useManager(props, ThirdPersonCamera)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
