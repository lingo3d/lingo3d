<script setup lang="ts">
import { Tetrahedron } from "lingo3d"
import useManager from "../../../hooks/useManager"
import primitiveProps from "../../../props/primitiveProps"

const props = defineProps(primitiveProps)
useManager(props, Tetrahedron)
</script>

<template>
  <slot />
</template>
