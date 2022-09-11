type BorderProps = {
    side?: "top" | "bottom" | "right"
}

const Border = ({ side }: BorderProps) => {
    if (side === "right")
        return (
            <div
                style={{
                    paddingTop: 6,
                    paddingBottom: 6,
                    height: "100%",
                    position: "absolute",
                    right: 0,
                    top: 0
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: 1,
                        background: "rgb(255,255,255,0.1)"
                    }}
                />
            </div>
        )

    return (
        <div
            style={{
                paddingLeft: 6,
                paddingRight: 6,
                width: "100%",
                position: "absolute",
                left: 0,
                ...(side === "top" ? { top: 0 } : { bottom: 0 })
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: 1,
                    background: "rgb(255,255,255,0.1)"
                }}
            />
        </div>
    )
}

export default Border
