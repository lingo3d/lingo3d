<script setup lang="ts">
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { objectManagerDefaults } from "lingo3d/lib/interface/IObjectManager"
import { inject, ref, watchEffect, computed, Ref } from "vue"
import useDiffProps from "../../hooks/useDiffProps"
import findProps from "../../props/findProps"

const props = defineProps(findProps)

const parentRef = inject<Ref<ObjectManager> | undefined>("parent", undefined)
const managerRef = ref<ObjectManager>()

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