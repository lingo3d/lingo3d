<script setup lang="ts">
import { Scene } from "lingo3d"
import useManager from "../../hooks/useManager"
import sceneProps from "../../props/sceneProps"

const props = defineProps(sceneProps)
const manager = useManager(props, Scene)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
