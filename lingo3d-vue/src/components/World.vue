<script setup lang="ts">
import { PropType, ref, watchEffect, computed } from "vue"
import { applySetup, container } from "lingo3d"
import { setResolution } from "lingo3d/lib/states/useResolution"
import { setViewportSize } from "lingo3d/lib/states/useViewportSize"
import index from "lingo3d"
import { preventTreeShake } from "@lincode/utils"
import scene from "lingo3d/lib/engine/scene"
import setupProps from "../props/setupProps"
import htmlContainer from "./logical/HTML/htmlContainer"

preventTreeShake(index)

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
    el.appendChild(htmlContainer)

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
    <div :style="style">
        <div ref="divRef" style="width: 100%; height: 100%; left: 0px; top: 0px; position: absolute" />
        <slot />
    </div>
</template>