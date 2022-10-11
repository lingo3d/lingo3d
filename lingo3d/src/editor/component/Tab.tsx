import { pull } from "@lincode/utils"
import { createContext } from "preact"
import { useContext, useEffect, useLayoutEffect } from "preact/hooks"
import CloseIcon from "./icons/CloseIcon"
import TitleBarButton from "./TitleBarButton"

export const TabContext = createContext<{
    selected: string | undefined
    setSelected: (val: string | undefined) => void
    tabs: Array<string>
}>({ selected: "", setSelected: () => {}, tabs: [] })

type TabProps = {
    onClose?: (selected: boolean) => void
    children?: string
    selected?: boolean
}

const Tab = ({ onClose, children, selected }: TabProps) => {
    const context = useContext(TabContext)

    useLayoutEffect(() => {
        if (!children) return
        context.tabs.push(children)
        return () => {
            context.setSelected(
                context.tabs[context.tabs.indexOf(children) - 1]
            )
            pull(context.tabs, children)
        }
    }, [])

    useEffect(() => {
        selected && context.setSelected(children)
    }, [])

    return (
        <div
            className="lingo3d-bg"
            style={{
                height: 24,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                background:
                    context.selected === children
                        ? "rgba(255, 255, 255, 0.1)"
                        : undefined
            }}
            onClick={() => context.setSelected(children)}
        >
            {children}
            <div style={{ width: 4 }} />
            <TitleBarButton
                disabled={!onClose}
                onClick={() => onClose?.(context.selected === children)}
            >
                <CloseIcon />
            </TitleBarButton>
        </div>
    )
}

export default Tab
