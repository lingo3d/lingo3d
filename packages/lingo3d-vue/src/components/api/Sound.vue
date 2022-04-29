<script setup lang="ts">
import { Sound } from "lingo3d"
import useManager from "../../hooks/useManager"
import soundProps from "../../props/soundProps"

const props = defineProps(soundProps)
const manager = useManager(props, Sound)
defineExpose(manager)
</script>

<template>
</template>