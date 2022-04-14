<script setup lang="ts">
import { ThirdPersonCamera } from "lingo3d"
import useManager from "../../../hooks/useManager"
import thirdPersonCameraProps from "../../../props/thirdPersonCameraProps"

const props = defineProps(thirdPersonCameraProps)
useManager(props, ThirdPersonCamera)
</script>

<template>
  <slot />
</template>
