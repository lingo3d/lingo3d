<script setup lang="ts">
import { SvgMesh } from "lingo3d"
import useManager from "../../hooks/useManager"
import svgMeshProps from "../../props/svgMeshProps"

const props = defineProps(svgMeshProps)
useManager(props, SvgMesh)
</script>

<template>
  <slot />
</template>
