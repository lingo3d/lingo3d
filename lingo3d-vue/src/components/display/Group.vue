<script setup lang="ts">
import { Group } from "lingo3d"
import useManager from "../../hooks/useManager"
import groupProps from "../../props/groupProps"

const props = defineProps(groupProps)
useManager(props, Group)
</script>

<template>
  <slot />
</template>
