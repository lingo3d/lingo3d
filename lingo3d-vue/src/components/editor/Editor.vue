<script setup lang="ts">
import Editor from "lingo3d/lib/editor/Editor"
import { PropType } from "vue"
import useEditor from "../../hooks/useEditor"

const props = defineProps({
  mouse: {
    type: String as PropType<"enabled" | "disabled">,
    default: "disabled"
  },
  keyboard: {
    type: String as PropType<"enabled" | "disabled">,
    default: "disabled"
  }
})

const divRef = useEditor(Editor, props)
</script>

<template>
  <div ref="divRef" class="lingo3d-ui" style="height: 100%;" />
</template>
