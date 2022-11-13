import register from "preact-custom-element"
import { APPBAR_HEIGHT } from "../../globals"
import useResizeObserver from "../hooks/useResizeObserver"
import useInitCSS from "../utils/useInitCSS"
import FrameGrid from "./FrameGrid"
import Layers from "./Layers"

const Timeline = () => {
    useInitCSS(true)
    const [ref, { width }] = useResizeObserver()

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-panels"
            style={{
                height: 200 - APPBAR_HEIGHT,
                width: "100%",
                display: "flex"
            }}
        >
            <div style={{ overflow: "scroll", width: 200 }}>
                <Layers />
            </div>
            <div style={{ flexGrow: 1 }}>
                <div
                    ref={ref}
                    className="lingo3d-absfull"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        borderTop: "1px solid rgba(255, 255, 255, 0.2)"
                    }}
                >
                    <FrameGrid width={width} />
                </div>
            </div>
        </div>
    )
}
export default Timeline

register(Timeline, "lingo3d-timeline")
