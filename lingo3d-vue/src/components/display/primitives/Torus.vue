<script setup lang="ts">
import { Torus } from "lingo3d"
import useManager from "../../../hooks/useManager"
import primitiveProps from "../../../props/primitiveProps"

const props = defineProps(primitiveProps)
useManager(props, Torus)
</script>

<template>
  <slot />
</template>
