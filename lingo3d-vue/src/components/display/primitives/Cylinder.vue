<script setup lang="ts">
import { Cylinder } from "lingo3d"
import useManager from "../../../hooks/useManager"
import cylinderProps from "../../../props/cylinderProps"

const props = defineProps(cylinderProps)
const manager = useManager(props, Cylinder)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
