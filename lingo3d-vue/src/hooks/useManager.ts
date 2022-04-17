import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { inject, onUnmounted, provide, Ref, ref, watchEffect } from "vue"
import useDiffProps from "./useDiffProps"

export default (props: Record<string, any>, ManagerClass: any) => {
    const manager = new ManagerClass()
    const managerRef = ref(manager)
    provide("parent", managerRef)

    const parentRef = inject<Ref<ObjectManager> | undefined>("parent", undefined)
    watchEffect(() => {
        parentRef?.value?.append(manager)
    })
    
    const diff = useDiffProps(props, ManagerClass.defaults)

    watchEffect(() => {
        for (const [key, value] of diff.value)
            manager[key] = value ?? ManagerClass.defaults[key]
    })

    onUnmounted(() => manager.dispose())

    return manager
}