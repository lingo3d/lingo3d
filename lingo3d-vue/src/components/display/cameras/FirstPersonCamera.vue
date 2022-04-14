<script setup lang="ts">
import { FirstPersonCamera } from "lingo3d"
import useManager from "../../../hooks/useManager"
import firstPersonCameraProps from "../../../props/firstPersonCameraProps"

const props = defineProps(firstPersonCameraProps)
useManager(props, FirstPersonCamera)
</script>

<template>
  <slot />
</template>
