<script setup lang="ts">
import { SpotLight } from "lingo3d"
import useManager from "../../../hooks/useManager"
import spotLightProps from "../../../props/spotLightProps"

const props = defineProps(spotLightProps)
useManager(props, SpotLight)
</script>

<template>
  <slot />
</template>
