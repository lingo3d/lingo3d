import { ComponentChildren } from "preact"

type TitleBarProps = {
    title?: string
    children?: ComponentChildren
}

const TitleBar = ({ title, children }: TitleBarProps) => {
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
            {title}
            <div style={{ flexGrow: 1, minWidth: 4 }} />
            {children}
        </div>
    )
}

export default TitleBar
