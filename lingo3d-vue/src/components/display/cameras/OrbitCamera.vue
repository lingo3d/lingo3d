<script setup lang="ts">
import { OrbitCamera } from "lingo3d"
import useManager from "../../../hooks/useManager"
import orbitCameraProps from "../../../props/orbitCameraProps"

const props = defineProps(orbitCameraProps)
const manager = useManager(props, OrbitCamera)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
