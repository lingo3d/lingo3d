<script setup lang="ts">
import { Dummy } from "lingo3d"
import useManager from "../../hooks/useManager"
import dummyProps from "../../props/dummyProps"

const props = defineProps(dummyProps)
const manager = useManager(props, Dummy)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
