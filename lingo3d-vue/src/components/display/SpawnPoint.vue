<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { SpawnPoint } from "lingo3d"
import useManager from "../../hooks/useManager"
import spawnPointProps from "../../props/spawnPointProps"

const props = defineProps(spawnPointProps)
const manager = useManager(props, SpawnPoint)
defineExpose(manager)
</script>

<template>
  <slot />
</template>
