<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { Environment } from "lingo3d"
import useManager from "../../hooks/useManager"
import environmentProps from "../../props/environmentProps"

const props = defineProps(environmentProps)
const manager = useManager(props, Environment)
defineExpose(manager)
</script>

<template></template>
