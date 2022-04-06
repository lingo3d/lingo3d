<script setup lang="ts">
import { PropType, ref, watchEffect } from "vue"
import { container, outline, settings } from "lingo3d"
import index from "lingo3d"
import { preventTreeShake } from "@lincode/utils"
import { SetupNode } from "lingo3d/lib/display/utils/deserialize/types"
import scene from "lingo3d/lib/engine/scene"

preventTreeShake(index)
outline.style.display = "none"
settings.autoMout = false

for (const child of [...scene.children])
    child.userData.manager && scene.remove(child)

const props = defineProps({
    position: String as PropType<"absolute" | "relative" | "fixed">
})
const style = { width: "100%", height: "100%", position: props.position ?? "absolute", top: 0, left: 0 }

const divRef = ref<HTMLDivElement | undefined>(undefined)

watchEffect(onCleanUp => {
    const el = divRef.value
    if (!el) return

    el.appendChild(container)

    const resizeObserver = new ResizeObserver(() => {
        settings.resolution = settings.viewportSize = [el.clientWidth, el.clientHeight]
    })
    resizeObserver.observe(el)

    onCleanUp(() => {
        resizeObserver.disconnect()
    })
})
</script>

<template>
    <div ref="divRef" :style="style" />
    <slot />
</template>