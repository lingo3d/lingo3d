<script setup lang="ts">
import { Trigger } from "lingo3d"
import useManager from "../../hooks/useManager"
import triggerProps from "../../props/triggerProps"

const props = defineProps(triggerProps)
const manager = useManager(props, Trigger)
defineExpose(manager)
</script>

<template></template>
