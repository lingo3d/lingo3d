import { Cancellable } from "@lincode/promiselikes"
import { Reactive } from "@lincode/reactivity"
import { forceGet } from "@lincode/utils"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import SimpleObjectManager from "lingo3d/lib/display/core/SimpleObjectManager"
import { inject, onUnmounted, provide, Ref, ref, watchEffect } from "vue"
import useDiffProps from "./useDiffProps"

const handleStore = new WeakMap<SimpleObjectManager, Map<string, Cancellable>>()
const makeHandleMap = () => new Map<string, Cancellable>()

export const applyChanges = (managerRef: Ref<any> | undefined, manager: any | undefined, diff: Ref<Array<[string, any]>>, defaults: Record<string, any>) => {
    watchEffect(() => {
        manager ??= managerRef?.value
        if (!manager) return

        const handleMap = forceGet(handleStore, manager, makeHandleMap)
    
        for (const [key, value] of diff.value) {
            handleMap.get(key)?.cancel()
            
            if (value instanceof Reactive) {
                handleMap.set(key, value.get(v => manager[key] = v))
                continue
            }
            manager[key] = value ?? defaults[key]
        }
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

    onUnmounted(() => {
        const handleMap = handleStore.get(manager)
        if (handleMap)
            for (const handle of handleMap.values())
                handle.cancel()

        manager.dispose()
    })

    return manager
}