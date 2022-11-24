import { ComponentChildren } from "preact"

export type ButtonProps = {
    children?: ComponentChildren
    disabled?: boolean
    onClick?: (e: MouseEvent) => void
}

const Button = ({ children, disabled, onClick }: ButtonProps) => {
    return (
        <div
            className="lingo3d-bg lingo3d-flexcenter"
            style={{
                opacity: disabled ? 0.1 : 1,
                marginLeft: 4,
                marginRight: 14,
                height: 20,
                display: "flex",
                gap: 4,
                cursor: disabled ? undefined : "pointer"
            }}
            onClick={disabled ? undefined : onClick}
        >
            {children}
        </div>
    )
}

export default Button
