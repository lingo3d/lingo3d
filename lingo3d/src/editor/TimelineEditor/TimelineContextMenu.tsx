import { set } from "@lincode/utils"
import { uuidMap } from "../../api/core/collections"
import { emitTimelineClearKeyframe } from "../../events/onTimelineClearKeyframe"
import ContextMenu from "../component/ContextMenu"
import MenuItem from "../component/ContextMenu/MenuItem"
import { useTimelineContextMenu } from "../states/useTimelineContextMenu"
import { processFrame } from "../states/useTimelineData"

const TimelineContextMenu = () => {
    const [menu, setMenu] = useTimelineContextMenu()

    return (
        <ContextMenu position={menu} setPosition={setMenu}>
            <MenuItem
                disabled={menu?.keyframe}
                onClick={() => {
                    processFrame((timelineData, uuid, property, frame) =>
                        set(
                            timelineData,
                            [uuid, property, frame],
                            (uuidMap.get(uuid) as any)[property]
                        )
                    )
                    setMenu(undefined)
                }}
            >
                Add keyframe
            </MenuItem>
            <MenuItem
                disabled={!menu?.keyframe}
                onClick={() => {
                    emitTimelineClearKeyframe()
                    setMenu(undefined)
                }}
            >
                Clear keyframe
            </MenuItem>
        </ContextMenu>
    )
}

export default TimelineContextMenu
