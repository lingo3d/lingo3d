<script setup lang="ts">
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { objectManagerDefaults } from "lingo3d/lib/interface/IObjectManager";
import { inject, ref, watchEffect, computed } from "vue"
import useDiffProps from "../hooks/useDiffProps"
import managerProps from "../props/managerProps"

const props = defineProps({
    ...managerProps,
    onLoad: Function
})

const parent: any = inject("parent", undefined)
const managerRef = ref<ObjectManager>()

watchEffect(onCleanUp => {
    const { name } = props
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

watchEffect(() => {
    const manager = managerRef.value
    if (!manager) return

    for (const [key, value] of diff.value)
        //@ts-ignore
        manager[key] = value ?? objectManagerDefaults[key]
})

defineExpose(managerRef)

watchEffect(() => {
    managerRef.value && props.onLoad?.()
})

</script>

<template>
    <slot />
</template>