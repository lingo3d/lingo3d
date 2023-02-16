<script setup lang="ts">
import { Cone } from "lingo3d"
import useManager from "../../../hooks/useManager"
import coneProps from "../../../props/coneProps"

const props = defineProps(coneProps)
const manager = useManager(props, Cone)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
