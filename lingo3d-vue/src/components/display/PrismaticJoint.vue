<script setup lang="ts">
import { PrismaticJoint } from "lingo3d"
import useManager from "../../hooks/useManager"
import prismaticJointProps from "../../props/prismaticJointProps"

const props = defineProps(prismaticJointProps)
const manager = useManager(props, PrismaticJoint)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
