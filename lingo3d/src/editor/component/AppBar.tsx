import { ComponentChildren } from "preact"

type AppBarProps = {
    children?: ComponentChildren
}

const AppBar = ({ children }: AppBarProps) => {
    return (
        <div
            className="lingo3d-bg"
            style={{
                height: 24,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                paddingRight: 4,
                flexShrink: 0
            }}
        >
            {children}
        </div>
    )
}

export default AppBar
