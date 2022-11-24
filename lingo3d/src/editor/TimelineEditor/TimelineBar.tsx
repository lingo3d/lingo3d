import AppBar from "../component/bars/AppBar"
import Button from "../component/Button"
import { setTimelineContextMenu } from "../states/useTimelineContextMenu"
import AudioIcon from "./icons/AudioIcon"

const TimelineBar = () => {
    return (
        <AppBar>
            <Button
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
