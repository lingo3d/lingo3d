<script setup lang="ts">
import { RevoluteJoint } from "lingo3d"
import useManager from "../../hooks/useManager"
import revoluteJointProps from "../../props/revoluteJointProps"

const props = defineProps(revoluteJointProps)
const manager = useManager(props, RevoluteJoint)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
