<script setup lang="ts">
import LingoEditor from "lingo3d/lib/editor/LingoEditor"
import useEditor from "../../hooks/useEditor"

const divRef = useEditor(LingoEditor, { embedded: true })
</script>

<template>
  <div ref="divRef" style="height: 100%" />
</template>
