<script setup lang="ts">
import { Reflector } from "lingo3d"
import useManager from "../../hooks/useManager"
import reflectorProps from "../../props/reflectorProps"

const props = defineProps(reflectorProps)
useManager(props, Reflector)
</script>

<template>
  <slot />
</template>
