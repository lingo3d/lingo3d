import { ComponentChildren } from "preact"
import { APPBAR_HEIGHT } from "../../../globals"

type TitleBarButtonProps = {
    children?: ComponentChildren
    onClick?: () => void
    disabled?: boolean
}

const TitleBarButton = ({
    children,
    onClick,
    disabled
}: TitleBarButtonProps) => {
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
            style={{
                width: APPBAR_HEIGHT,
                height: APPBAR_HEIGHT,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 2,
                opacity: disabled ? 0.1 : 0.5,
                cursor: disabled ? "default" : "pointer"
            }}
        >
            {children}
        </div>
    )
}

export default TitleBarButton
