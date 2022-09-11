import { useRef, useState } from "preact/hooks"

interface MenuButtonProps {
    children: string
    onClick?: (e: { left: number; top: number }) => void
}

const MenuButton = ({ children, onClick }: MenuButtonProps) => {
    const [hover, setHover] = useState(false)
    const olRef = useRef<HTMLOListElement>(null)

    const handleClick = () => {
        const ol = olRef.current
        if (!ol) return

        const { left, top } = ol.getBoundingClientRect()
        onClick?.({ left, top })
    }

    return (
        <ol
            ref={olRef}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={handleClick}
            style={{
                whiteSpace: "nowrap",
                textAlign: "left",
                padding: "5px 10px 5px 10px",
                borderRadius: "4px",
                background: hover ? "rgba(255, 255, 255, 0.1)" : undefined
            }}
        >
            {children}
        </ol>
    )
}
export default MenuButton
