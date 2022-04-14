<script setup lang="ts">
import { Camera } from "lingo3d"
import useManager from "../../../hooks/useManager"
import cameraProps from "../../../props/cameraProps"

const props = defineProps(cameraProps)
useManager(props, Camera)
</script>

<template>
  <slot />
</template>
