<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { Setup } from "lingo3d"
import useManager from "../../hooks/useManager"
import setupProps from "../../props/setupProps"

const props = defineProps(setupProps)
const manager = useManager(props, Setup)
defineExpose(manager)
</script>

<template></template>
