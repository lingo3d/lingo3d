import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { inject, onUnmounted, provide, Ref, ref, watchEffect } from "vue"
import useDiffProps from "./useDiffProps"

export const applyChanges = (managerRef: Ref<any> | undefined, manager: any | undefined, diff: Ref<Array<[string, any]>>, defaults: Record<string, any>) => {
    watchEffect(() => {
        manager ??= managerRef?.value
        if (!manager) return
    
        for (const [key, value] of diff.value)
            manager[key] = value ?? defaults[key]
    })
}

export default (props: Record<string, any>, ManagerClass: any) => {
    const manager = new ManagerClass()
    const managerRef = ref(manager)
    provide("parent", managerRef)

    const parentRef = inject<Ref<ObjectManager> | undefined>("parent", undefined)
    watchEffect(() => {
        parentRef?.value?.append(manager)
    })
    
    if (!ManagerClass.defaults)
        console.error("ManagerClass has no defaults", ManagerClass)

    const diff = useDiffProps(props, ManagerClass.defaults)
    applyChanges(undefined, manager, diff, ManagerClass.defaults)

    onUnmounted(() => manager.dispose())

    return manager
}