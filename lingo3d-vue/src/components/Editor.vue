<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from "vue"
import { Editor as LingoEditor } from "lingo3d"

const props = defineProps({
    blockKeyboard: { type: Boolean, default: true },
    blockMouse: { type: Boolean, default: true }
})
const editor = new LingoEditor()

watchEffect(() => {
    editor.blockKeyboard = props.blockKeyboard
    editor.blockMouse = props.blockMouse
})

onUnmounted(() => {
    editor.remove()
})

const divRef = ref<HTMLDivElement>()

watchEffect(onCleanUp => {
    const el = divRef.value
    if (!el) return

    el.appendChild(editor)

    onCleanUp(() => {
        editor.remove()
    })
})

</script>

<template>
    <div ref="divRef" />
</template>