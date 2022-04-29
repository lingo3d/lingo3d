<script setup lang="ts">
import { Camera } from "lingo3d"
import useManager from "../../../hooks/useManager"
import cameraProps from "../../../props/cameraProps"

const props = defineProps(cameraProps)
const manager = useManager(props, Camera)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
