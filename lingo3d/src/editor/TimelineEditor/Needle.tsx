import { APPBAR_HEIGHT, FRAME_WIDTH, PANELS_HEIGHT } from "../../globals"
import { useRef } from "preact/hooks"
import { timelineNeedlePtr } from "../../pointers/timelineNeedlePtr"

const Needle = () => {
    const ref = useRef<HTMLDivElement>(null)
    timelineNeedlePtr[0] = ref.current

    return (
        <div
            className="lingo3d-absfull"
            style={{
                height: PANELS_HEIGHT,
                zIndex: 1,
                overflow: "hidden",
                pointerEvents: "none"
            }}
        >
            <div
                ref={ref}
                style={{
                    position: "absolute",
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
