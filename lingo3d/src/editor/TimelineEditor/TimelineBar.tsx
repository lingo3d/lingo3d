import AppBar from "../component/bars/AppBar"
import Button from "../component/Button"
import { useTimeline } from "../states/useTimeline"
import { setTimelineContextMenu } from "../states/useTimelineContextMenu"
import AudioIcon from "./icons/AudioIcon"

const TimelineBar = () => {
    const [timeline] = useTimeline()

    return (
        <AppBar>
            <Button
                disabled={!timeline}
                onClick={(e) =>
                    setTimelineContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        addAudio: true
                    })
                }
            >
                <AudioIcon />
                Add audio
            </Button>
        </AppBar>
    )
}

export default TimelineBar
