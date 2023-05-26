import { ComponentChildren } from "preact"
import { APPBAR_HEIGHT } from "../../globals"
import { stopPropagation } from "../utils/stopPropagation"

type IconButtonProps = {
    children?: ComponentChildren
    onClick?: (e: MouseEvent) => void
    disabled?: boolean
    label?: string
    borderless?: boolean
    fill?: boolean | string
}

const IconButton = ({
    children,
    onClick,
    disabled,
    label,
    borderless,
    fill
}: IconButtonProps) => {
    return (
        <div
            ref={stopPropagation}
            onClick={onClick}
            className="lingo3d-flexcenter"
            style={{
                pointerEvents: disabled ? "none" : undefined,
                minWidth: APPBAR_HEIGHT,
                height: APPBAR_HEIGHT - 4,
                opacity: disabled ? 0.1 : 1,
                cursor: disabled ? undefined : "pointer",
                background: fill
                    ? typeof fill === "string"
                        ? fill
                        : "rgba(255, 255, 255, 0.1)"
                    : undefined,
                border: !borderless
                    ? "1px solid rgba(255, 255, 255, 0.25)"
                    : undefined
            }}
        >
            {label && children && <div style={{ width: 10 }} />}
            {children && (
                <div className="lingo3d-flexcenter" style={{ opacity: 0.75 }}>
                    {children}
                </div>
            )}
            {label && (
                <div style={{ paddingLeft: 10, paddingRight: 10 }}>{label}</div>
            )}
        </div>
    )
}

export default IconButton
