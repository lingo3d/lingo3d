import { onUnmounted, watchEffect } from "vue"
import useDiffProps from "./useDiffProps"

export default (props: Record<string, any>, ManagerClass: any) => {
    const manager = new ManagerClass()

    const diff = useDiffProps(props)

    watchEffect(() => {
        for (const [key, value] of diff.value)
            manager[key] = value
    })

    onUnmounted(() => manager.dispose())
}