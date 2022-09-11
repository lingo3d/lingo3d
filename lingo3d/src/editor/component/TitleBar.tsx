import { preventTreeShake } from "@lincode/utils"
import { ComponentChildren, h } from "preact"

preventTreeShake(h)

type TitleBarProps = {
    title?: string
    children?: ComponentChildren
    gap?: number
}

const TitleBar = ({ title, children, gap }: TitleBarProps) => {
    return (
        <div
            className="lingo3d-bg"
            style={{
                height: 24,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                paddingRight: gap
            }}
        >
            <div>{title}</div>
            <div style={{ flexGrow: 1, minWidth: gap }} />
            {children}
        </div>
    )
}

export default TitleBar
