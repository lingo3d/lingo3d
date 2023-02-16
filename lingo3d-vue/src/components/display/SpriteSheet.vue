<script setup lang="ts">
import { SpriteSheet } from "lingo3d"
import useManager from "../../hooks/useManager"
import spriteSheetProps from "../../props/spriteSheetProps"

const props = defineProps(spriteSheetProps)
const manager = useManager(props, SpriteSheet)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
