<script setup lang="ts">
import { Circle } from "lingo3d"
import useManager from "../../../hooks/useManager"
import circleProps from "../../../props/circleProps"

const props = defineProps(circleProps)
const manager = useManager(props, Circle)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
