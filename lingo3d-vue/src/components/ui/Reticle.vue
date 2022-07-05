<script setup lang="ts">
import { Reticle } from "lingo3d"
import useManager from "../../hooks/useManager"
import reticleProps from "../../props/reticleProps"

const props = defineProps(reticleProps)
const manager = useManager(props, Reticle)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
