<script setup lang="ts">
import { Torus } from "lingo3d"
import useManager from "../../../hooks/useManager"
import torusProps from "../../../props/torusProps"

const props = defineProps(torusProps)
const manager = useManager(props, Torus)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
