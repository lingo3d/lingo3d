import { FRAME_WIDTH } from "../../globals"

const Needle = () => {
    return (
        <div
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: FRAME_WIDTH,
                height: "100%",
                background: "white",
                opacity: 0.3,
                zIndex: 1
            }}
        >
            <div
                style={{
                    width: 1,
                    height: 200,
                    background: "white",
                    position: "absolute",
                    left: FRAME_WIDTH * 0.5
                }}
            />
        </div>
    )
}

export default Needle
