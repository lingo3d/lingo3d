import { useEffect, useState } from "preact/hooks"
import TitleBarButton from "../component/bars/TitleBarButton"
import { useTimeline } from "../states"
import { useTimelineFrame } from "../states/useTimelineFrame"
import NextFrameIcon from "./icons/NextFrameIcon"
import PauseIcon from "./icons/PauseIcon"
import PlayIcon from "./icons/PlayIcon"
import PrevFrameIcon from "./icons/PrevFrameIcon"

const Controls = () => {
    const [timeline] = useTimeline()
    const [paused, setPaused] = useState(true)
    const [frame] = useTimelineFrame()

    useEffect(() => {
        //@ts-ignore
        timeline?.pausedState.get(setPaused)
    }, [timeline])

    return (
        <div
            className="lingo3d-bg"
            style={{
                position: "absolute",
                bottom: 8,
                border: "1px solid rgba(100, 100, 100, 0.1)",
                zIndex: 1,
                display: "flex"
            }}
        >
            <TitleBarButton disabled={!timeline || !paused}>
                <PlayIcon />
            </TitleBarButton>
            <TitleBarButton disabled={!timeline || paused}>
                <PauseIcon />
            </TitleBarButton>
            <TitleBarButton disabled={!timeline || frame < 1}>
                <PrevFrameIcon />
            </TitleBarButton>
            <TitleBarButton
                disabled={!timeline || frame >= timeline.totalFrames}
            >
                <NextFrameIcon />
            </TitleBarButton>
        </div>
    )
}

export default Controls
