<script setup lang="ts">
import Toolbar from "lingo3d/lib/editor/Toolbar"
import { PropType } from "vue"
import useEditor from "../../hooks/useEditor"

type ButtonOptions = {
  hidden?: boolean
  onClick?: () => void
}

const props = defineProps({
  buttons: {
    type: Object as PropType<{
      openJSON?: ButtonOptions
      exportJSON?: ButtonOptions
      exportReact?: ButtonOptions
      exportVue?: ButtonOptions
    }>,
    default: {}
  }
})

const divRef = useEditor(Toolbar, props)
</script>

<template>
  <div ref="divRef" class="lingo3d-ui" style="height: 100%;" />
</template>
