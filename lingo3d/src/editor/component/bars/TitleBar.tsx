import { ComponentChildren } from "preact"
import AppBar from "./AppBar"

type TitleBarProps = {
    title?: string
    children?: ComponentChildren
}

const TitleBar = ({ title, children }: TitleBarProps) => {
    return (
        <AppBar style={{ paddingLeft: 12 }}>
            <div style={{ marginTop: -2 }}>{title}</div>
            <div style={{ flexGrow: 1, minWidth: 4 }} />
            <div style={{ display: "flex", opacity: 0.5 }}>{children}</div>
        </AppBar>
    )
}

export default TitleBar
