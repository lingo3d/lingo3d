<script setup lang="ts">
import { Cube } from "lingo3d"
import useManager from "../../../hooks/useManager"
import primitiveProps from "../../../props/primitiveProps"

const props = defineProps(primitiveProps)

useManager(props, Cube)
</script>

<template>
  <slot />
</template>
