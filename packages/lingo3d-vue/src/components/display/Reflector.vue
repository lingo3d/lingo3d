<script setup lang="ts">
import { Reflector } from "lingo3d"
import useManager from "../../hooks/useManager"
import reflectorProps from "../../props/reflectorProps"

const props = defineProps(reflectorProps)
const manager = useManager(props, Reflector)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
