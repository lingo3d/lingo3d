<script setup lang="ts">
import { SkyLight } from "lingo3d"
import useManager from "../../../hooks/useManager"
import skyLightProps from "../../../props/skyLightProps"

const props = defineProps(skyLightProps)
useManager(props, SkyLight)
</script>

<template>
  <slot />
</template>
