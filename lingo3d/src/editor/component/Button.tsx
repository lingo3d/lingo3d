import { ComponentChildren } from "preact"

export type ButtonProps = {
    children?: ComponentChildren
    disabled?: boolean
    onClick?: () => void
}

const Button = ({ children, disabled, onClick }: ButtonProps) => {
    return (
        <div
            className="lingo3d-bg lingo3d-flexcenter"
            style={{
                opacity: disabled ? 0.1 : 1,
                height: 20,
                padding: 12,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                gap: 10,
                cursor: "pointer"
            }}
            onClick={disabled ? undefined : onClick}
        >
            {children}
        </div>
    )
}

export default Button
