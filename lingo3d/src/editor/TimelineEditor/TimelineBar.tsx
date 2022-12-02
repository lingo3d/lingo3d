import AppBar from "../component/bars/AppBar"
import Button from "../component/Button"
import useSyncState from "../hooks/useSyncState"
import { getTimeline } from "../../states/useTimeline"
import { setTimelineContextMenu } from "../../states/useTimelineContextMenu"
import AddIcon from "./icons/AddIcon"

const TimelineBar = () => {
    const timeline = useSyncState(getTimeline)

    return (
        <AppBar>
            <Button
                onClick={(e) =>
                    setTimelineContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        create: "timeline"
                    })
                }
            >
                <AddIcon />
                New timeline
            </Button>
            <Button
                disabled={!timeline}
                onClick={(e) =>
                    setTimelineContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        create: "audio"
                    })
                }
            >
                <AddIcon />
                Audio
            </Button>
        </AppBar>
    )
}

export default TimelineBar
