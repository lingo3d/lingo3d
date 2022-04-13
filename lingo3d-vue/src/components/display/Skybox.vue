<script setup lang="ts">
import { Skybox } from "lingo3d"
import useManager from "../../hooks/useManager"
import skyboxProps from "../../props/skyboxProps"

const props = defineProps(skyboxProps)
useManager(props, Skybox)
</script>

<template>
  <slot />
</template>
