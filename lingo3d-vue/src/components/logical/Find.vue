<script setup lang="ts">
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { objectManagerDefaults } from "lingo3d/lib/interface/IObjectManager"
import { inject, ref, watchEffect, computed, Ref, provide } from "vue"
import useDiffProps from "../../hooks/useDiffProps"
import { applyChanges } from "../../hooks/useManager"
import findProps from "../../props/findProps"

const props = defineProps(findProps)

const parentRef = inject<Ref<ObjectManager> | undefined>("parent", undefined)
const managerRef = ref<ObjectManager>()
provide("parent", managerRef)

watchEffect(onCleanUp => {
    const { name } = props
    const parent = parentRef?.value
    if (!parent || !name) return
    
    if ("loadedResolvable" in parent){
        //@ts-ignore
        const handle = parent.loadedResolvable.then(() => managerRef.value = parent.find(name))
        return onCleanUp(() => {
            handle.cancel()
        })
    }
    managerRef.value = parent.find(name)
})

const paused = computed(() => !managerRef.value)
const diff = useDiffProps(props, objectManagerDefaults, paused)
applyChanges(managerRef, undefined, diff, objectManagerDefaults)

defineExpose(managerRef)

watchEffect(() => {
    managerRef.value && props.onLoad?.()
})

</script>

<template>
    <slot />
</template>