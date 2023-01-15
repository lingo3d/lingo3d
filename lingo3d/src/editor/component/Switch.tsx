type SwitchProps = {
    label?: string
}

const Switch = ({ label }: SwitchProps) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginLeft: 4
            }}
        >
            <div
                style={{
                    width: 40,
                    height: 20,
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: 999,
                    padding: 2
                }}
            >
                <div
                    style={{
                        width: 16,
                        height: 16,
                        background: "rgba(255, 255, 255, 0.5)",
                        borderRadius: 999
                    }}
                />
            </div>
            {label}
        </div>
    )
}
export default Switch
