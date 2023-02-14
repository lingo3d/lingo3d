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
    noPadding?: boolean
    transparent?: boolean
}

const AppBar = ({
    className,
    style,
    children,
    selectedSignal = useSignal<string | undefined>(undefined),
    noPadding,
    transparent
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
                paddingRight: noPadding ? undefined : 4,
                paddingLeft: noPadding ? undefined : 4,
                flexShrink: 0,
                background: transparent ? undefined : "rgb(16, 17, 20)",
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
