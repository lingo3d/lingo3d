<script setup lang="ts">
import { Sprite } from "lingo3d"
import useManager from "../../hooks/useManager"
import spriteProps from "../../props/spriteProps"

const props = defineProps(spriteProps)
const manager = useManager(props, Sprite)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
