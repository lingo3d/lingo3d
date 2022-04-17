<script setup lang="ts">
import { FirstPersonCamera } from "lingo3d"
import useManager from "../../../hooks/useManager"
import firstPersonCameraProps from "../../../props/firstPersonCameraProps"

const props = defineProps(firstPersonCameraProps)
const manager = useManager(props, FirstPersonCamera)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
