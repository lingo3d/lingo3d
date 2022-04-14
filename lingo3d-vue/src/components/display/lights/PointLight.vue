<script setup lang="ts">
import { PointLight } from "lingo3d"
import useManager from "../../../hooks/useManager"
import pointLightProps from "../../../props/pointLightProps"

const props = defineProps(pointLightProps)
useManager(props, PointLight)
</script>

<template>
  <slot />
</template>
