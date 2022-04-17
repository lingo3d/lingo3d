<script setup lang="ts">
import { Sphere } from "lingo3d"
import useManager from "../../../hooks/useManager"
import primitiveProps from "../../../props/primitiveProps"

const props = defineProps(primitiveProps)
const manager = useManager(props, Sphere)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
