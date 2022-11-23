import { emitTimelineClearKeyframe } from "../../events/onTimelineClearKeyframe"
import ContextMenu from "../component/ContextMenu"
import MenuItem from "../component/ContextMenu/MenuItem"
import { useTimelineContextMenu } from "../states/useTimelineContextMenu"

const TimelineContextMenu = () => {
    const [menu, setMenu] = useTimelineContextMenu()

    return (
        <ContextMenu position={menu} setPosition={setMenu}>
            <MenuItem
                disabled={!menu?.keyframe}
                onClick={() => {
                    emitTimelineClearKeyframe()
                    setMenu(undefined)
                }}
            >
                clear keyframe
            </MenuItem>
        </ContextMenu>
    )
}

export default TimelineContextMenu
