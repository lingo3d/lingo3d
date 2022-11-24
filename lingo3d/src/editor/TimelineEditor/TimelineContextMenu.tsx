import { get, set } from "@lincode/utils"
import { uuidMap } from "../../api/core/collections"
import { emitTimelineClearKeyframe } from "../../events/onTimelineClearKeyframe"
import { AnimationData } from "../../interface/IAnimationManager"
import ContextMenu from "../component/ContextMenu"
import MenuItem from "../component/ContextMenu/MenuItem"
import { useTimelineContextMenu } from "../states/useTimelineContextMenu"
import { processKeyframe } from "../states/useTimelineData"

const TimelineContextMenu = () => {
    const [menu, setMenu] = useTimelineContextMenu()

    return (
        <ContextMenu position={menu} setPosition={setMenu}>
            <MenuItem
                disabled={menu?.keyframe}
                onClick={() => {
                    processKeyframe((timelineData, uuid, property, frame) =>
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
                    const data: AnimationData = {}
                    processKeyframe(
                        (timelineData, uuid, property, frame) =>
                            set(
                                data,
                                [uuid, property, frame],
                                get(timelineData, [uuid, property, frame])
                            ),
                        true
                    )
                    console.log(data)
                    setMenu(undefined)
                }}
            >
                Copy keyframe
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
