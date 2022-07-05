<script setup lang="ts">
import Library from "lingo3d/lib/editor/Library"
import useEditor from "../../hooks/useEditor"

const divRef = useEditor(Library)
</script>

<template>
  <div ref="divRef" class="lingo3d-ui" style="height: 100%;" />
</template>
