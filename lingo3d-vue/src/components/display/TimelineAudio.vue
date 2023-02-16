<script setup lang="ts">
import { TimelineAudio } from "lingo3d"
import useManager from "../../hooks/useManager"
import timelineAudioProps from "../../props/timelineAudioProps"

const props = defineProps(timelineAudioProps)
const manager = useManager(props, TimelineAudio)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
