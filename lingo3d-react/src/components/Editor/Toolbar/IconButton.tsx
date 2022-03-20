import React from "react"

interface IconButtonProps {
    onClick?: () => void
    active?: boolean
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, active, children }) => {
    return (
        <div onClick={onClick} style={{
            width: 20,
            height: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            opacity: active ? 1 : 0.5
        }}>
            {children}
        </div>
    )
}

export default IconButton
