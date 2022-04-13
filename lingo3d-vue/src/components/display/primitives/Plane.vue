<script setup lang="ts">
import { Plane } from "lingo3d"
import useManager from "../../../hooks/useManager"
import primitiveProps from "../../../props/primitiveProps"

const props = defineProps(primitiveProps)
useManager(props, Plane)
</script>

<template>
  <slot />
</template>
