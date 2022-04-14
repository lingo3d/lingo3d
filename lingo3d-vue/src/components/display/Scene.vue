<script setup lang="ts">
import { Scene } from "lingo3d"
import useManager from "../../hooks/useManager"
import sceneProps from "../../props/sceneProps"

const props = defineProps(sceneProps)
useManager(props, Scene)
</script>

<template>
  <slot />
</template>
