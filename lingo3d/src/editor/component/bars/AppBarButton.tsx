import { ComponentChildren } from "preact"
import { APPBAR_HEIGHT } from "../../../globals"

type AppBarButtonProps = {
    children?: ComponentChildren
    onClick?: () => void
    disabled?: boolean
    fill?: boolean
}

const AppBarButton = ({
    children,
    onClick,
    disabled,
    fill
}: AppBarButtonProps) => {
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
                height: APPBAR_HEIGHT,
                marginRight: 2,
                opacity: disabled ? 0.1 : 0.5,
                cursor: disabled ? "default" : "pointer",
                background: fill ? "rgba(255, 255, 255, 0.1)" : undefined
            }}
        >
            {children}
        </div>
    )
}

export default AppBarButton
