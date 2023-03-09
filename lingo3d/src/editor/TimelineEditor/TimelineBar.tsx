import AppBar from "../component/bars/AppBar"
import Button from "../component/Button"
import useSyncState from "../hooks/useSyncState"
import { getTimeline } from "../../states/useTimeline"
import AddIcon from "./icons/AddIcon"
import { Signal } from "@preact/signals"
import { TimelineContextMenuPosition } from "."

type TimelineBarProps = {
    positionSignal: Signal<TimelineContextMenuPosition>
}

const TimelineBar = ({ positionSignal }: TimelineBarProps) => {
    const timeline = useSyncState(getTimeline)

    return (
        <AppBar>
            <Button
                onClick={(e) =>
                    (positionSignal.value = {
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
                    (positionSignal.value = {
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
