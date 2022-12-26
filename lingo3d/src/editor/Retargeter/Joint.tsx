type JointProps = {
    x: number
    y: number
    onMouseMove?: (e: MouseEvent) => void
    onMouseLeave?: (e: MouseEvent) => void
}

const Joint = ({ x, y, onMouseMove, onMouseLeave }: JointProps) => {
    return (
        <div
            style={{
                position: "absolute",
                width: 14,
                height: 14,
                left: 50 - 2 + x + "%",
                top: y + "%",
                borderRadius: 20,
                border: "1px solid rgba(255, 255, 255, 0.5)",
                background: "rgba(255, 255, 255, 0.2)"
            }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        />
    )
}

export default Joint
