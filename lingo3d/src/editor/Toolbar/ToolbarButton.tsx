import { ComponentChildren } from "preact"

export type ToolbarButtonProps = {
    children: ComponentChildren
    onClick?: () => void
    active?: boolean
    disabled?: boolean
}

const ToolbarButton = ({
    children,
    onClick,
    active,
    disabled
}: ToolbarButtonProps) => {
    return (
        <div
            className="lingo3d-flexcenter"
            style={{
                width: 30,
                height: 30,
                margin: 6,
                borderRadius: 4,
                background: active ? "rgba(255, 255, 255, 0.1)" : undefined,
                opacity: disabled ? 0.25 : active ? 1 : 0.75,
                cursor: "pointer"
            }}
            onClick={disabled || active ? undefined : onClick}
        >
            {children}
        </div>
    )
}

export default ToolbarButton
