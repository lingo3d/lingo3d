<script setup lang="ts">
import "lingo3d/lib/editor"

const props = defineProps({
    unblockKeyboard: { type: Boolean, default: false },
    unblockMouse: { type: Boolean, default: false }
})
</script>

<template>
    <lingo3d-editor :unblock-keyboard="props.unblockKeyboard" :unblock-mouse="props.unblockMouse" />
</template>