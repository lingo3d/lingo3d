<script setup lang="ts">
import { AmbientLight } from "lingo3d"
import useManager from "../../../hooks/useManager"
import ambientLightProps from "../../../props/ambientLightProps"

const props = defineProps(ambientLightProps)
const manager = useManager(props, AmbientLight)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
