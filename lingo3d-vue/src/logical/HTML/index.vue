<script setup lang="ts">
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { nanoid } from "nanoid"
import { inject, onMounted, onUnmounted, useSlots, VNode } from "vue"
import { elements } from "./render"

const parent: any = inject("parent", undefined)
const slots = useSlots()

let pair: [Array<VNode>, ObjectManager, string] | undefined
const id = nanoid()

onMounted(() => {
    const children = slots.default?.()
    if (!children || !parent) return

    pair = [children, parent, id]
    elements.value = [...elements.value, pair]
})
onUnmounted(() => {
    elements.value = elements.value.filter(([, , _id]) => id !== _id)
})
</script>

<template>
</template>