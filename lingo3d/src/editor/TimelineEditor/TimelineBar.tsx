import AppBar from "../component/bars/AppBar"
import Button from "../component/Button"
import useSyncState from "../hooks/useSyncState"
import { getTimeline } from "../../states/useTimeline"
import AddIcon from "./icons/AddIcon"
import timelineMenuSignal from "./TimelineContextMenu/timelineMenuSignal"

const TimelineBar = () => {
    const timeline = useSyncState(getTimeline)

    return (
        <AppBar>
            <Button
                onClick={(e) =>
                    (timelineMenuSignal.value = {
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
                    (timelineMenuSignal.value = {
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
