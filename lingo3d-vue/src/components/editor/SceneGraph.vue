<script setup lang="ts">
import SceneGraph from "lingo3d/lib/editor/SceneGraph"
import useEditor from "../../hooks/useEditor"

const divRef = useEditor(SceneGraph)
</script>

<template>
  <div ref="divRef" class="lingo3d-ui" style="height: 100%;" />
</template>
