import { getExtensionType } from "@lincode/filetypes"
import { get, set } from "@lincode/utils"
import { useState } from "preact/hooks"
import Timeline from "../../display/Timeline"
import TimelineAudio from "../../display/TimelineAudio"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { emitTimelineClearKeyframe } from "../../events/onTimelineClearKeyframe"
import { AnimationData } from "../../interface/IAnimationManager"
import unsafeGetValue from "../../utils/unsafeGetValue"
import ContextMenu from "../component/ContextMenu"
import MenuButton from "../component/MenuButton"
import useSyncState from "../hooks/useSyncState"
import { setTimeline } from "../../states/useTimeline"
import { getTimelineData, processKeyframe } from "../../states/useTimelineData"
import { getTimelineLayer } from "../../states/useTimelineLayer"
import { Signal, signal } from "@preact/signals"
import { uuidMapAssertGet } from "../../collections/idCollections"
import { timelinePtr } from "../../pointers/timelinePtr"
import { timelineFramePtr } from "../../pointers/timelineFramePtr"
import { PointType } from "../../typeGuards/isPoint"

export const timelineContextMenuSignal: Signal<
    | (PointType & {
          keyframe?: boolean
          create?: "audio" | "timeline"
      })
    | undefined
> = signal(undefined)

const TimelineContextMenu = () => {
    const [dataCopied, setDataCopied] = useState<AnimationData>()
    const [timelineData] = useSyncState(getTimelineData)
    const timelineLayer = useSyncState(getTimelineLayer)

    return (
        <ContextMenu
            positionSignal={timelineContextMenuSignal}
            input={
                timelineContextMenuSignal.value?.create === "audio"
                    ? {
                          label: "Audio src",
                          onInput: (value) => {
                              const [timeline] = timelinePtr
                              if (!timeline) return

                              const audio = new TimelineAudio()
                              audio.name = value
                              if (getExtensionType(value) === "audio")
                                  audio.src = value
                              timeline.mergeData({ [audio.uuid]: {} })
                              timeline.append(audio)
                              //todo: refactor sceneGraphExpanded to make below work
                              // setSceneGraphExpanded(new Set([timeline.$object]))
                              emitSelectionTarget(audio)
                          }
                      }
                    : timelineContextMenuSignal.value?.create === "timeline"
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
                    timelineContextMenuSignal.value?.keyframe ||
                    !timelineData ||
                    !timelineLayer ||
                    !(timelineLayer.split(" ")[0] in timelineData)
                }
                onClick={() => {
                    processKeyframe((timelineData, uuid, property, frame) =>
                        set(
                            timelineData,
                            [uuid, property, frame],
                            unsafeGetValue(uuidMapAssertGet(uuid), property)
                        )
                    )
                    timelineContextMenuSignal.value = undefined
                }}
            >
                Add keyframe
            </MenuButton>
            <MenuButton
                disabled={!timelineContextMenuSignal.value?.keyframe}
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
                    timelineContextMenuSignal.value = undefined
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
                              const frame = timelineFramePtr[0] + ""
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
                              timelinePtr[0]?.mergeData(data)
                              timelineContextMenuSignal.value = undefined
                          }
                        : undefined
                }
            >
                Paste keyframe
            </MenuButton>
            <MenuButton
                disabled={!timelineContextMenuSignal.value?.keyframe}
                onClick={() => {
                    emitTimelineClearKeyframe()
                    timelineContextMenuSignal.value = undefined
                }}
            >
                Clear keyframe
            </MenuButton>
        </ContextMenu>
    )
}

export default TimelineContextMenu
