<script setup lang="ts">
import { Cone } from "lingo3d"
import useManager from "../../../hooks/useManager"
import primitiveProps from "../../../props/primitiveProps"

const props = defineProps(primitiveProps)
useManager(props, Cone)
</script>

<template>
  <slot />
</template>
