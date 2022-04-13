<script setup lang="ts">
import { Circle } from "lingo3d"
import useManager from "../../../hooks/useManager"
import primitiveProps from "../../../props/primitiveProps"

const props = defineProps(primitiveProps)
useManager(props, Circle)
</script>

<template>
  <slot />
</template>
