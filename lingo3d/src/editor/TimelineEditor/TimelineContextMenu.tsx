import { getExtensionType } from "@lincode/filetypes"
import { get, set } from "@lincode/utils"
import { useState } from "preact/hooks"
import { uuidMap } from "../../api/core/collections"
import Timeline from "../../display/Timeline"
import TimelineAudio from "../../display/TimelineAudio"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { emitTimelineClearKeyframe } from "../../events/onTimelineClearKeyframe"
import { AnimationData } from "../../interface/IAnimationManager"
import unsafeGetValue from "../../utils/unsafeGetValue"
import ContextMenu from "../component/ContextMenu"
import ContextMenuItem from "../component/ContextMenu/ContextMenuItem"
import useSyncState from "../hooks/useSyncState"
import { setSceneGraphExpanded } from "../../states/useSceneGraphExpanded"
import { getTimeline, setTimeline } from "../../states/useTimeline"
import {
    getTimelineContextMenu,
    setTimelineContextMenu
} from "../../states/useTimelineContextMenu"
import { processKeyframe } from "../../states/useTimelineData"
import { getTimelineFrame } from "../../states/useTimelineFrame"

const TimelineContextMenu = () => {
    const menu = useSyncState(getTimelineContextMenu)
    const [dataCopied, setDataCopied] = useState<AnimationData>()
    const timeline = useSyncState(getTimeline)

    return (
        <ContextMenu
            position={menu}
            setPosition={setTimelineContextMenu}
            input={
                menu?.create &&
                (menu.create === "audio" ? "Audio name" : "Timeline name")
            }
            onInput={(value) => {
                if (menu?.create === "audio") {
                    const timeline = getTimeline()
                    if (!timeline) return

                    const audio = new TimelineAudio()
                    audio.name = value
                    if (getExtensionType(value) === "audio") audio.src = value
                    timeline.mergeData({ [audio.uuid]: {} })
                    timeline.append(audio)
                    setSceneGraphExpanded(new Set([timeline.outerObject3d]))
                    emitSelectionTarget(audio)
                    return
                }
                const timeline = new Timeline()
                timeline.name = value
                timeline.data = {}
                setTimeline(timeline)
                emitSelectionTarget(timeline)
            }}
        >
            <ContextMenuItem
                disabled={menu?.keyframe || !timeline}
                onClick={() => {
                    processKeyframe((timelineData, uuid, property, frame) =>
                        set(
                            timelineData,
                            [uuid, property, frame],
                            unsafeGetValue(uuidMap.get(uuid)!, property)
                        )
                    )
                    setTimelineContextMenu(undefined)
                }}
            >
                Add keyframe
            </ContextMenuItem>
            <ContextMenuItem
                disabled={!menu?.keyframe}
                onClick={() => {
                    const data: AnimationData = {}
                    processKeyframe(
                        (timelineData, uuid, property, frame) =>
                            set(
                                data,
                                [uuid, property, "0"],
                                get(timelineData, [uuid, property, frame])
                            ),
                        true
                    )
                    setDataCopied(data)
                    setTimelineContextMenu(undefined)
                }}
            >
                Copy keyframe
            </ContextMenuItem>
            <ContextMenuItem
                disabled={!dataCopied}
                onClick={
                    dataCopied
                        ? () => {
                              const data: AnimationData = {}
                              const frame = getTimelineFrame() + ""
                              for (const [uuid, properties] of Object.entries(
                                  dataCopied
                              ))
                                  for (const [
                                      property,
                                      frames
                                  ] of Object.entries(properties))
                                      for (const value of Object.values(frames))
                                          set(
                                              data,
                                              [uuid, property, frame],
                                              value
                                          )
                              getTimeline()?.mergeData(data)
                              setTimelineContextMenu(undefined)
                          }
                        : undefined
                }
            >
                Paste keyframe
            </ContextMenuItem>
            <ContextMenuItem
                disabled={!menu?.keyframe}
                onClick={() => {
                    emitTimelineClearKeyframe()
                    setTimelineContextMenu(undefined)
                }}
            >
                Clear keyframe
            </ContextMenuItem>
        </ContextMenu>
    )
}

export default TimelineContextMenu
