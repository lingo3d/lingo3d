<script setup lang="ts">
import { DefaultSkyLight } from "lingo3d"
import useManager from "../../../hooks/useManager"
import defaultSkyLightProps from "../../../props/defaultSkyLightProps"

const props = defineProps(defaultSkyLightProps)
const manager = useManager(props, DefaultSkyLight)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
