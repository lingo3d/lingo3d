<script setup lang="ts">
import { AreaLight } from "lingo3d"
import useManager from "../../../hooks/useManager"
import areaLightProps from "../../../props/areaLightProps"

const props = defineProps(areaLightProps)
const manager = useManager(props, AreaLight)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
