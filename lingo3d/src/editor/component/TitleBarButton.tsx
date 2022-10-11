import { ComponentChildren } from "preact"

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
                width: 24,
                height: 24,
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
