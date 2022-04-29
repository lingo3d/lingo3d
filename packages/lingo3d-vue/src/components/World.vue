<script setup lang="ts">
import { PropType, ref, watchEffect, computed } from "vue"
import { applySetup, container, outline } from "lingo3d"
import { setResolution } from "lingo3d/lib/states/useResolution"
import { setViewportSize } from "lingo3d/lib/states/useViewportSize"
import index from "lingo3d"
import { preventTreeShake } from "@lincode/utils"
import scene from "lingo3d/lib/engine/scene"
import setupProps from "../props/setupProps"

preventTreeShake(index)
outline.style.border = "none"
outline.style.pointerEvents = "none"
outline.style.userSelect = "none"
outline.style.overflow = "hidden"

for (const child of [...scene.children])
    child.userData.manager && scene.remove(child)

const props = defineProps({
    ...setupProps,
    position: String as PropType<"absolute" | "relative" | "fixed">
})
const style = computed(() => ({ width: "100%", height: "100%", position: props.position ?? "absolute", top: 0, left: 0 }))

const divRef = ref<HTMLDivElement>()

watchEffect(onCleanUp => {
    const el = divRef.value
    if (!el) return

    el.appendChild(container)

    const resizeObserver = new ResizeObserver(() => {
        const res: [number, number] = [el.clientWidth, el.clientHeight]
        setResolution(res)
        setViewportSize(res)
    })
    resizeObserver.observe(el)

    onCleanUp(() => {
        resizeObserver.disconnect()
    })
})

watchEffect(onCleanUp => {
    applySetup(props as any)

    onCleanUp(() => {
        applySetup({})
    })
})
</script>

<template>
    <div ref="divRef" :style="style" />
    <slot />
</template>