<script setup lang="ts">
import "lingo3d/lib/editor"

const props = defineProps({
    blockKeyboard: { type: Boolean, default: true },
    blockMouse: { type: Boolean, default: true }
})
</script>

<template>
    <lingo3d-editor :block-keyboard="props.blockKeyboard" :block-mouse="props.blockMouse" />
</template>