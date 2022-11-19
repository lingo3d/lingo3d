import { APPBAR_HEIGHT, FRAME_WIDTH, PANELS_HEIGHT } from "../../globals"
import { useTimelineScrollLeft } from "../states"

const Needle = () => {
    const [scrollLeft] = useTimelineScrollLeft()

    return (
        <div
            className="lingo3d-absfull"
            style={{
                height: PANELS_HEIGHT,
                zIndex: 1,
                overflow: "hidden"
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: -scrollLeft,
                    top: 0,
                    width: FRAME_WIDTH,
                    height: APPBAR_HEIGHT,
                    background: "white",
                    opacity: 0.3
                }}
            >
                <div
                    style={{
                        width: 1,
                        height: PANELS_HEIGHT,
                        background: "white",
                        position: "absolute",
                        left: FRAME_WIDTH * 0.5
                    }}
                />
            </div>
        </div>
    )
}

export default Needle
