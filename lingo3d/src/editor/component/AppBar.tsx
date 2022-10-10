import { ComponentChildren } from "preact"
import { CSSProperties } from "preact/compat"

type AppBarProps = {
    className?: string
    children?: ComponentChildren
    style?: CSSProperties
}

const AppBar = ({ className, style, children }: AppBarProps) => {
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
            {children}
        </div>
    )
}

export default AppBar
