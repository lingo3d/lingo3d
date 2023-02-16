<script setup lang="ts">
import { FixedJoint } from "lingo3d"
import useManager from "../../hooks/useManager"
import fixedJointProps from "../../props/fixedJointProps"

const props = defineProps(fixedJointProps)
const manager = useManager(props, FixedJoint)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
