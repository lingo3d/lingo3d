<script setup lang="ts">
import { Sprite } from "lingo3d"
import useManager from "../../hooks/useManager"
import spriteProps from "../../props/spriteProps"

const props = defineProps(spriteProps)
useManager(props, Sprite)
</script>

<template>
  <slot />
</template>
