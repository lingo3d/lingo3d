<script setup lang="ts">
import { SphericalJoint } from "lingo3d"
import useManager from "../../hooks/useManager"
import sphericalJointProps from "../../props/sphericalJointProps"

const props = defineProps(sphericalJointProps)
const manager = useManager(props, SphericalJoint)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
