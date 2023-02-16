<script setup lang="ts">
import { Plane } from "lingo3d"
import useManager from "../../../hooks/useManager"
import planeProps from "../../../props/planeProps"

const props = defineProps(planeProps)
const manager = useManager(props, Plane)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
