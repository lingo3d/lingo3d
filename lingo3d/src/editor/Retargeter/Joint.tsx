type JointProps = {
    x: number
    y: number
}

const Joint = ({ x, y }: JointProps) => {
    return (
        <div
            style={{
                position: "absolute",
                width: 14,
                height: 14,
                left: 50.7 + x + "%",
                top: 0.5 + y + "%",
                borderRadius: 20,
                border: "2px solid blue"
            }}
        />
    )
}

export default Joint
