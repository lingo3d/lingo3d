<script setup lang="ts">
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { pull } from "lodash";
import { nanoid } from "nanoid"
import { inject, onUnmounted, Ref, useSlots, VNode, watch } from "vue"
import { elements, renderRef } from "./render"

const parentRef = inject<Ref<ObjectManager> | undefined>("parent", undefined)
const slots = useSlots()

let pair: [Array<VNode>, ObjectManager, string] | undefined
const id = nanoid()

parentRef && watch(parentRef, () => {
    const parent = parentRef?.value
    const children = slots.default?.()
    if (!children || !parent || pair) return

    pair = [children, parent, id]
    elements.push(pair)
    renderRef.value = {}

}, { immediate: true })

onUnmounted(() => {
    pull(elements, pair)
    renderRef.value = {}
})
</script>

<template>
</template>