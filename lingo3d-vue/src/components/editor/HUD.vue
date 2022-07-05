<script setup lang="ts">
import HUD from "lingo3d/lib/editor/HUD"
import useEditor from "../../hooks/useEditor"

const divRef = useEditor(HUD)
</script>

<template>
  <div ref="divRef" class="lingo3d-ui" style="overflow: visible" />
</template>
