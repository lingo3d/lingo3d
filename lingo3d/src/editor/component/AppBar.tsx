import { ComponentChildren } from "preact"
import { CSSProperties, useState } from "preact/compat"
import { TabContext } from "./Tab"

type AppBarProps = {
    className?: string
    children?: ComponentChildren
    style?: CSSProperties
}

const AppBar = ({ className, style, children }: AppBarProps) => {
    const [selected, setSelected] = useState<string | undefined>(undefined)

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
            <TabContext.Provider value={{ selected, setSelected }}>
                {children}
            </TabContext.Provider>
        </div>
    )
}

export default AppBar
