<script setup lang="ts">
import { Mouse } from "lingo3d"
import useManager from "../../hooks/useManager"
import mouseProps from "../../props/mouseProps"

const props = defineProps(mouseProps)
const manager = useManager(props, Mouse)
defineExpose(manager)
</script>

<template></template>
