<script setup lang="ts">
import { Plane } from "lingo3d"
import useManager from "../../../hooks/useManager"
import primitiveProps from "../../../props/primitiveProps"

const props = defineProps(primitiveProps)
const manager = useManager(props, Plane)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
