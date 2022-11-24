import { ComponentChildren } from "preact"
import { CSSProperties, useEffect, useMemo } from "preact/compat"
import { APPBAR_HEIGHT } from "../../../globals"
import { TabContext } from "../tabs/useTab"
import { Signal, useSignal } from "@preact/signals"

type AppBarProps = {
    className?: string
    children?: ComponentChildren
    style?: CSSProperties
    selectedSignal?: Signal<string | undefined>
}

const AppBar = ({
    className,
    style,
    children,
    selectedSignal = useSignal<string | undefined>(undefined)
}: AppBarProps) => {
    const tabs = useMemo<Array<string>>(() => [], [])

    useEffect(() => {
        selectedSignal.value ??= tabs[0]
    }, [])

    return (
        <div
            className={className}
            style={{
                width: "100%",
                height: APPBAR_HEIGHT + 8,
                display: "flex",
                alignItems: "center",
                paddingRight: 4,
                paddingLeft: 4,
                flexShrink: 0,
                background: "rgba(0, 0, 0, 0.1)",
                ...style
            }}
        >
            <TabContext.Provider value={{ selectedSignal, tabs }}>
                {children}
            </TabContext.Provider>
        </div>
    )
}

export default AppBar
