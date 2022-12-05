import { APPBAR_HEIGHT, FRAME_WIDTH, PANELS_HEIGHT } from "../../globals"
import { getTimelineFrame } from "../../states/useTimelineFrame"
import { getTimelineScrollLeft } from "../../states/useTimelineScrollLeft"
import { useEffect, useRef } from "preact/hooks"
import { createEffect } from "@lincode/reactivity"

const Needle = () => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const div = ref.current
        if (!div) return

        const handle = createEffect(() => {
            const frame = getTimelineFrame()
            const scrollLeft = getTimelineScrollLeft()
            div.style.left = `${-scrollLeft + frame * FRAME_WIDTH}px`
        }, [getTimelineFrame, getTimelineScrollLeft])

        return () => {
            handle.cancel()
        }
    }, [])

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
