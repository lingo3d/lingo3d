<script setup lang="ts">
import { ref, watchEffect } from "vue"
import { Editor as LingoEditor } from "lingo3d"

const divRef = ref<HTMLDivElement>()

watchEffect(onCleanUp => {
    const el = divRef.value
    if (!el) return

    const editor = new LingoEditor()
    el.appendChild(editor)

    onCleanUp(() => {
        editor.remove()
    })
})

</script>

<template>
    <div ref="divRef" />
</template>