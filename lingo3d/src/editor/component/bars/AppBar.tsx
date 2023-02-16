import { ComponentChildren } from "preact"
import { CSSProperties } from "preact/compat"
import { APPBAR_HEIGHT } from "../../../globals"

type AppBarProps = {
    className?: string
    children?: ComponentChildren
    style?: CSSProperties
    noPadding?: boolean
}

const AppBar = ({ className, style, children, noPadding }: AppBarProps) => {
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
                ...style
            }}
        >
            {children}
        </div>
    )
}

export default AppBar
