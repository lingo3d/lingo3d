<script setup lang="ts">
import { Timeline } from "lingo3d"
import useManager from "../../hooks/useManager"
import timelineProps from "../../props/timelineProps"

const props = defineProps(timelineProps)
const manager = useManager(props, Timeline)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
