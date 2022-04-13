<script setup lang="ts">
import { Cylinder } from "lingo3d"
import useManager from "../../../hooks/useManager"
import primitiveProps from "../../../props/primitiveProps"

const props = defineProps(primitiveProps)
useManager(props, Cylinder)
</script>

<template>
  <slot />
</template>
