<script setup lang="ts">
import Toolbar from "lingo3d/lib/editor/Toolbar"
import useEditor from "../../hooks/useEditor"

const divRef = useEditor(Toolbar)
</script>

<template>
  <div ref="divRef" class="lingo3d-ui" style="height: 100%" />
</template>
