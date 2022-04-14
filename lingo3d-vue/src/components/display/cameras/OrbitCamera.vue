<script setup lang="ts">
import { OrbitCamera } from "lingo3d"
import useManager from "../../../hooks/useManager"
import orbitCameraProps from "../../../props/orbitCameraProps"

const props = defineProps(orbitCameraProps)
useManager(props, OrbitCamera)
</script>

<template>
  <slot />
</template>
