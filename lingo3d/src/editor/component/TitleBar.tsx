import { preventTreeShake } from "@lincode/utils"
import { ComponentChildren, h } from "preact"

preventTreeShake(h)

type TitleBarProps = {
    title?: string
    children?: ComponentChildren
}

const TitleBar = ({ title, children }: TitleBarProps) => {
    return (
        <div
            style={{
                height: 24,
                borderBottom: "1px solid rgb(255,255,255,0.1)",
                opacity: 0.5,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12
            }}
        >
            <div>{title}</div>
            <div style={{ flexGrow: 1 }} />
            {children}
        </div>
    )
}

export default TitleBar
