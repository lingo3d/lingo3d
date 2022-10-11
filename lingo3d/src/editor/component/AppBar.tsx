import { ComponentChildren } from "preact"
import { CSSProperties, useEffect, useMemo, useState } from "preact/compat"
import { TabContext } from "./Tab"

type AppBarProps = {
    className?: string
    children?: ComponentChildren
    style?: CSSProperties
    onSelectTab?: (tab: string | undefined) => void
}

const AppBar = ({ className, style, children, onSelectTab }: AppBarProps) => {
    const [selected, setSelected] = useState<string | undefined>(undefined)
    const tabs = useMemo<Array<string>>(() => [], [])

    useEffect(() => {
        setSelected(tabs[0])
    }, [])

    useEffect(() => {
        onSelectTab?.(selected)
    }, [selected])

    return (
        <div
            className={className}
            style={{
                width: "100%",
                height: 24,
                display: "flex",
                alignItems: "center",
                paddingRight: 4,
                flexShrink: 0,
                background: "rgba(0, 0, 0, 0.1)",
                ...style
            }}
        >
            <TabContext.Provider value={{ selected, setSelected, tabs }}>
                {children}
            </TabContext.Provider>
        </div>
    )
}

export default AppBar
