<script setup lang="ts">
import { Cube } from "lingo3d";
import useManager from "../../../hooks/useManager"

const props = defineProps({
    x: {
        type: Number,
        default: 0
    },
    y: {
        type: Number,
        default: 0
    },
    z: {
        type: Number,
        default: 0
    },
    rotationX: {
        type: Number,
        default: 0
    },
    rotationY: {
        type: Number,
        default: 0
    },
    rotationZ: {
        type: Number,
        default: 0
    },
    color: {
        type: String,
        default: "#ffffff"
    }
})

useManager(props, Cube)
</script>

<template>
    <slot />
</template>