<script setup lang="ts">
import { pull } from "@lincode/utils"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { inject, useSlots, VNode, watchEffect } from "vue"
import { elements } from "./build"
import render from "./render"

const parent: any = inject("parent", undefined)
const slots = useSlots()

watchEffect(onCleanUp => {
    if (!parent) return

    const children = slots.default?.()
    if (!children) return

    const pair: [Array<VNode>, ObjectManager] = [children, parent]
    
    elements.push(pair)
    render()

    onCleanUp(() => {
        pull(elements, pair)
        render()
    })
})

    

</script>

<template>
    <slot />
</template>