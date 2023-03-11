import { getExtensionType } from "@lincode/filetypes"
import { get, set } from "@lincode/utils"
import { useState } from "preact/hooks"
import { uuidMap } from "../../../api/core/collections"
import Timeline from "../../../display/Timeline"
import TimelineAudio from "../../../display/TimelineAudio"
import { emitSelectionTarget } from "../../../events/onSelectionTarget"
import { emitTimelineClearKeyframe } from "../../../events/onTimelineClearKeyframe"
import { AnimationData } from "../../../interface/IAnimationManager"
import unsafeGetValue from "../../../utils/unsafeGetValue"
import ContextMenu from "../../component/ContextMenu"
import MenuButton from "../../component/MenuButton"
import useSyncState from "../../hooks/useSyncState"
import { getTimeline, setTimeline } from "../../../states/useTimeline"
import {
    getTimelineData,
    processKeyframe
} from "../../../states/useTimelineData"
import { getTimelineFrame } from "../../../states/useTimelineFrame"
import { getTimelineLayer } from "../../../states/useTimelineLayer"
import timelineMenuSignal from "./timelineMenuSignal"

const TimelineContextMenu = () => {
    const [dataCopied, setDataCopied] = useState<AnimationData>()
    const [timelineData] = useSyncState(getTimelineData)
    const timelineLayer = useSyncState(getTimelineLayer)

    return (
        <ContextMenu
            positionSignal={timelineMenuSignal}
            input={
                timelineMenuSignal.value?.create === "audio"
                    ? {
                          label: "Audio src",
                          onInput: (value) => {
                              const timeline = getTimeline()
                              if (!timeline) return

                              const audio = new TimelineAudio()
                              audio.name = value
                              if (getExtensionType(value) === "audio")
                                  audio.src = value
                              timeline.mergeData({ [audio.uuid]: {} })
                              timeline.append(audio)
                              //todo: refactor sceneGraphExpanded to make below work
                              // setSceneGraphExpanded(new Set([timeline.outerObject3d]))
                              emitSelectionTarget(audio)
                          }
                      }
                    : timelineMenuSignal.value?.create === "timeline"
                    ? {
                          label: "Timeline name",
                          onInput: (value) => {
                              const timeline = new Timeline()
                              timeline.name = value
                              timeline.data = {}
                              setTimeline(timeline)
                              emitSelectionTarget(timeline)
                          }
                      }
                    : undefined
            }
        >
            <MenuButton
                disabled={
                    timelineMenuSignal.value?.keyframe ||
                    !timelineData ||
                    !timelineLayer ||
                    !(timelineLayer.split(" ")[0] in timelineData)
                }
                onClick={() => {
                    processKeyframe((timelineData, uuid, property, frame) =>
                        set(
                            timelineData,
                            [uuid, property, frame],
                            unsafeGetValue(uuidMap.get(uuid)!, property)
                        )
                    )
                    timelineMenuSignal.value = undefined
                }}
            >
                Add keyframe
            </MenuButton>
            <MenuButton
                disabled={!timelineMenuSignal.value?.keyframe}
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
                    timelineMenuSignal.value = undefined
                }}
            >
                Copy keyframe
            </MenuButton>
            <MenuButton
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
                              timelineMenuSignal.value = undefined
                          }
                        : undefined
                }
            >
                Paste keyframe
            </MenuButton>
            <MenuButton
                disabled={!timelineMenuSignal.value?.keyframe}
                onClick={() => {
                    emitTimelineClearKeyframe()
                    timelineMenuSignal.value = undefined
                }}
            >
                Clear keyframe
            </MenuButton>
        </ContextMenu>
    )
}

export default TimelineContextMenu
