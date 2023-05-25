import { useState } from "preact/hooks"
import { APPBAR_HEIGHT } from "../../globals"
import { Signal } from "@preact/signals"

type MenuItemProps = {
    disabled?: boolean
    highlight?: boolean
    onClick?: (e: MouseEvent) => void
    children: string
    compact?: boolean
    activeSignal?: Signal<any>
}

const MenuButton = ({
    disabled,
    highlight,
    onClick,
    children,
    compact,
    activeSignal
}: MenuItemProps) => {
    const [hover, setHover] = useState(false)

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                height: compact ? 20 : APPBAR_HEIGHT,
                paddingLeft: 20,
                paddingRight: 20,
                whiteSpace: "nowrap",
                background: disabled
                    ? undefined
                    : hover
                    ? "rgba(255, 255, 255, 0.1)"
                    : highlight
                    ? "rgba(255, 255, 255, 0.2)"
                    : activeSignal?.value
                    ? "rgba(255, 255, 255, 0.1)"
                    : undefined,
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? undefined : "pointer"
            }}
            onClick={disabled ? undefined : onClick}
            onMouseEnter={disabled ? undefined : () => setHover(true)}
            onMouseLeave={disabled ? undefined : () => setHover(false)}
        >
            {children}
        </div>
    )
}
export default MenuButton
