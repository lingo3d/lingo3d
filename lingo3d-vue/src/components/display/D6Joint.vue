<script setup lang="ts">
import { D6Joint } from "lingo3d"
import useManager from "../../hooks/useManager"
import d6JointProps from "../../props/d6JointProps"

const props = defineProps(d6JointProps)
const manager = useManager(props, D6Joint)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
