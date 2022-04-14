<script setup lang="ts">
import { DirectionalLight } from "lingo3d"
import useManager from "../../../hooks/useManager"
import directionalLightProps from "../../../props/directionalLightProps"

const props = defineProps(directionalLightProps)
useManager(props, DirectionalLight)
</script>

<template>
  <slot />
</template>
