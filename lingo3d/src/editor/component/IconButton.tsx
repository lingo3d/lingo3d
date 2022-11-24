import { ComponentChildren } from "preact"
import { APPBAR_HEIGHT } from "../../globals"

type IconButtonProps = {
    children?: ComponentChildren
    onClick?: () => void
    disabled?: boolean
    fill?: boolean
}

const IconButton = ({ children, onClick, disabled, fill }: IconButtonProps) => {
    return (
        <div
            onClick={
                disabled
                    ? undefined
                    : (e) => {
                          e.stopPropagation()
                          onClick?.()
                      }
            }
            className="lingo3d-flexcenter"
            style={{
                width: APPBAR_HEIGHT,
                height: APPBAR_HEIGHT - 4,
                marginRight: fill ? 8 : 2,
                opacity: disabled ? 0.1 : 0.5,
                cursor: disabled ? "default" : "pointer",
                background: fill ? "rgba(255, 255, 255, 0.1)" : undefined
            }}
        >
            {children}
        </div>
    )
}

export default IconButton
