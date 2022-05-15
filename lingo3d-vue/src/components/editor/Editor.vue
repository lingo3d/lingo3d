<script setup lang="ts">
import "lingo3d/lib/editor"
import { PropType } from "vue";

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

</script>

<template>
    <lingo3d-editor :mouse="props.mouse" :keyboard="props.keyboard" />
</template>