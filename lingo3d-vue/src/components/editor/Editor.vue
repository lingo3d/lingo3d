<script setup lang="ts">
import Editor from "lingo3d/lib/editor/Editor"
import useEditor from "../../hooks/useEditor"

const divRef = useEditor(Editor)
</script>

<template>
  <div ref="divRef" class="lingo3d-ui" style="height: 100%" />
</template>
