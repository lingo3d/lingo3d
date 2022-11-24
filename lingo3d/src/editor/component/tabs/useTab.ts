import { pull } from "@lincode/utils"
import { Signal } from "@preact/signals"
import { createContext } from "preact"
import { useContext, useLayoutEffect } from "preact/hooks"

export const TabContext = createContext<{
    selectedSignal: Signal<string | undefined>
    tabs: Array<string>
}>({} as any)

export default (children?: string, selected?: boolean, disabled?: boolean) => {
    const context = useContext(TabContext)
    const { selectedSignal, tabs } = context

    useLayoutEffect(() => {
        if (!children) return
        tabs.push(children)
        return () => {
            if (selectedSignal.value === children)
                selectedSignal.value = tabs[tabs.indexOf(children) - 1]
            pull(tabs, children)
        }
    }, [])

    useLayoutEffect(() => {
        if (!disabled || !children) return
        if (selectedSignal.value === children)
            selectedSignal.value = tabs[tabs.indexOf(children) - 1]
    }, [disabled])

    useLayoutEffect(() => {
        if (selected) selectedSignal.value = children
    }, [selected])

    return context
}
