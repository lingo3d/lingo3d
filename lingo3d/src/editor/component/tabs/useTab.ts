import { pull } from "@lincode/utils"
import { createContext } from "preact"
import { useContext, useLayoutEffect } from "preact/hooks"

export const TabContext = createContext<{
    selected: string | undefined
    setSelected: (val: string | undefined) => void
    tabs: Array<string>
}>({ selected: "", setSelected: () => {}, tabs: [] })

export default (children?: string, selected?: boolean, disabled?: boolean) => {
    const context = useContext(TabContext)

    useLayoutEffect(() => {
        if (!children) return
        context.tabs.push(children)
        return () => {
            context.selected === children &&
                context.setSelected(
                    (context.selected =
                        context.tabs[context.tabs.indexOf(children) - 1])
                )
            pull(context.tabs, children)
        }
    }, [])

    useLayoutEffect(() => {
        if (!disabled || !children) return
        context.selected === children &&
            context.setSelected(
                (context.selected =
                    context.tabs[context.tabs.indexOf(children) - 1])
            )
    }, [disabled])

    useLayoutEffect(() => {
        selected && context.setSelected((context.selected = children))
    }, [selected])

    return context
}
