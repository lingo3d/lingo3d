<script setup lang="ts">
import { pull } from "@lincode/utils"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { inject, useSlots, VNode, watchEffect } from "vue"
import { elements } from "./render"

const parent: any = inject("parent", undefined)
const slots = useSlots()

watchEffect(onCleanUp => {
    if (!parent) return

    const children = slots.default?.()
    if (!children) return

    const pair: [Array<VNode>, ObjectManager] = [children, parent]
    elements.value = [...elements.value, pair]

    onCleanUp(() => {
        pull(elements.value, pair)
        elements.value = [...elements.value]
    })
})

    

</script>

<template>
    <slot />
</template>