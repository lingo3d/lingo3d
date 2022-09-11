import { h } from "preact"
import { preventTreeShake } from "@lincode/utils"
import { useState } from "preact/hooks"

preventTreeShake(h)

type MenuItemProps = {
    disabled?: boolean
    onClick?: () => void
    setData: ((val: any) => void) | undefined
    children: string
}

const MenuItem = ({ disabled, onClick, setData, children }: MenuItemProps) => {
    const [hover, setHover] = useState(false)

    return (
        <div
            style={{
                padding: 6,
                whiteSpace: "nowrap",
                background:
                    !disabled && hover ? "rgba(255, 255, 255, 0.1)" : undefined,
                opacity: disabled ? 0.5 : 1
            }}
            onClick={
                disabled
                    ? undefined
                    : () => {
                          setData?.(undefined)
                          onClick?.()
                      }
            }
            onMouseEnter={disabled ? undefined : () => setHover(true)}
            onMouseLeave={disabled ? undefined : () => setHover(false)}
        >
            {children}
        </div>
    )
}
export default MenuItem
