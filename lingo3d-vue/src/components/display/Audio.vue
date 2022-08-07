<script setup lang="ts">
import { Audio } from "lingo3d"
import useManager from "../../hooks/useManager"
import audioProps from "../../props/audioProps"

const props = defineProps(audioProps)
const manager = useManager(props, Audio)
defineExpose(manager)
</script>

<template></template>
