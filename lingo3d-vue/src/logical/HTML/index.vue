<script setup lang="ts">
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { nanoid } from "nanoid"
import { inject, onMounted, onUnmounted, Ref, useSlots, VNode, watch } from "vue"
import { elements } from "./render"

const parentRef = inject<Ref<ObjectManager> | undefined>("parent", undefined)
const slots = useSlots()

let pair: [Array<VNode>, ObjectManager, string] | undefined
const id = nanoid()

parentRef && watch(parentRef, () => {
    const parent = parentRef?.value
    const children = slots.default?.()
    if (!children || !parent || pair) return

    pair = [children, parent, id]
    elements.value = [...elements.value, pair]

}, { immediate: true })

onUnmounted(() => {
    elements.value = elements.value.filter(([, , _id]) => id !== _id)
})
</script>

<template>
</template>