<script setup lang="ts">
import { Octahedron } from "lingo3d"
import useManager from "../../../hooks/useManager"
import primitiveProps from "../../../props/primitiveProps"

const props = defineProps(primitiveProps)
useManager(props, Octahedron)
</script>

<template>
  <slot />
</template>
