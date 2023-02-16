<script setup lang="ts">
import LingoEditor from "lingo3d/lib/editor/LingoEditor"
import useEditor from "../../hooks/useEditor"

const divRef = useEditor(LingoEditor)
</script>

<template>
  <div ref="divRef" style="width: 100vw; height: 100vh" />
</template>
