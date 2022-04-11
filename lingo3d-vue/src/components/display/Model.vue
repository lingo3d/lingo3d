<script setup lang="ts">
import { Model } from "lingo3d"
import useManager from "../../hooks/useManager"
import modelProps from "../../props/modelProps"

const props = defineProps(modelProps)

const manager = useManager(props, Model)
</script>

<template>
  <slot />
</template>
