<script setup lang="ts">
import { Cube } from "lingo3d"
import useManager from "../../../hooks/useManager"
import primitiveProps from "../../../props/primitiveProps"

const props = defineProps(primitiveProps)
const manager = useManager(props, Cube)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
