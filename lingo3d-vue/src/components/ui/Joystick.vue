<script setup lang="ts">
import { Joystick } from "lingo3d"
import useManager from "../../hooks/useManager"
import joystickProps from "../../props/joystickProps"

const props = defineProps(joystickProps)
const manager = useManager(props, Joystick)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
