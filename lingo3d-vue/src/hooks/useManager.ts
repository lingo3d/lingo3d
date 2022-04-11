import { inject, onUnmounted, provide, watchEffect } from "vue"
import useDiffProps from "./useDiffProps"

export default (props: Record<string, any>, ManagerClass: any) => {
    const manager = new ManagerClass()
    provide("parent", manager)

    const parent: any = inject("parent", undefined)
    parent?.append(manager)
    
    const diff = useDiffProps(props, ManagerClass.defaults)

    watchEffect(() => {
        for (const [key, value] of diff.value)
            manager[key] = value ?? ManagerClass.defaults[key]
    })

    onUnmounted(() => manager.dispose())

    return manager
}