import { ComponentChildren } from "preact"
import AppBar from "./AppBar"

type TitleBarProps = {
    title?: string
    children?: ComponentChildren
}

const TitleBar = ({ title, children }: TitleBarProps) => {
    return (
        <AppBar style={{ paddingLeft: 12, background: undefined }}>
            {title}
            <div style={{ flexGrow: 1, minWidth: 4 }} />
            {children}
        </AppBar>
    )
}

export default TitleBar
