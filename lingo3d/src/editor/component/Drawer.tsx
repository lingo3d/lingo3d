import { ComponentChild } from "preact"
import { CSSProperties } from "preact/compat"

type DrawerProps = {
    show?: boolean
    onHide?: () => void
    children?: ComponentChild
    style?: CSSProperties
    className?: string
    width?: number
    anchor?: "left" | "right"
    onDragOverMask?: () => void
}

const Drawer = ({
    show,
    onHide,
    children,
    style,
    className,
    width = 200,
    anchor = "left",
    onDragOverMask
}: DrawerProps) => {
    return (
        <div className="lingo3d-absfull" style={{ pointerEvents: "none" }}>
            <div
                className="lingo3d-absfull"
                style={{
                    background: "black",
                    opacity: show ? 0.5 : 0,
                    transition: "opacity 500ms",
                    pointerEvents: show ? "auto" : "none"
                }}
                onClick={onHide}
                onDragEnter={onDragOverMask}
            />
            <div
                className={className}
                style={{
                    width,
                    height: "100%",
                    position: "absolute",
                    left: anchor === "left" ? 0 : undefined,
                    right: anchor === "right" ? 0 : undefined,
                    transition: "transform 500ms",
                    transform: `translateX(${
                        show ? 0 : anchor === "left" ? -100 : 100
                    }%)`,
                    pointerEvents: "auto",
                    ...style
                }}
            >
                {children}
            </div>
        </div>
    )
}

export default Drawer
