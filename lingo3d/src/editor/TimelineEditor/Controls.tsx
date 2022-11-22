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
    const [frame, setFrame] = useTimelineFrame()

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
            {paused ? (
                <TitleBarButton
                    disabled={!timeline}
                    onClick={() => {
                        if (timeline!.frame >= timeline!.totalFrames)
                            timeline!.frame = 0
                        timeline!.paused = false
                    }}
                >
                    <PlayIcon />
                </TitleBarButton>
            ) : (
                <TitleBarButton
                    disabled={!timeline}
                    onClick={() => (timeline!.paused = true)}
                >
                    <PauseIcon />
                </TitleBarButton>
            )}
            <TitleBarButton
                disabled={!timeline || frame < 1}
                onClick={() => setFrame(frame - 1)}
            >
                <PrevFrameIcon />
            </TitleBarButton>
            <TitleBarButton
                disabled={!timeline || frame >= timeline.totalFrames}
                onClick={() => setFrame(frame + 1)}
            >
                <NextFrameIcon />
            </TitleBarButton>
        </div>
    )
}

export default Controls
