import { Cancellable } from "@lincode/promiselikes"
import { GetGlobalState } from "@lincode/reactivity"
import { filterBoolean, throttleTrailing } from "@lincode/utils"
import { AnimationClip, BooleanKeyframeTrack, NumberKeyframeTrack } from "three"
import { uuidMap } from "../../collections/idCollections"
import TimelineAudio from "../../display/TimelineAudio"
import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import { INVERSE_STANDARD_FRAME, STANDARD_FRAME } from "../../globals"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"
import { FrameValue, FrameData } from "../../interface/IAnimationManager"

const isBooleanFrameData = (
    values: Array<FrameValue>
): values is Array<boolean> => typeof values[0] === "boolean"

const isNumberFrameData = (
    values: Array<FrameValue>
): values is Array<number> => typeof values[0] === "number"

const framesToKeyframeTrack = (
    targetName: string,
    property: string,
    frames: FrameData
) => {
    const keys = Object.keys(frames)
    if (!keys.length) return

    const values = Object.values(frames)
    const name = targetName + "." + property
    const frameNums = keys.map(
        (frameNum) => Number(frameNum) * INVERSE_STANDARD_FRAME
    )

    if (isBooleanFrameData(values))
        return new BooleanKeyframeTrack(name, frameNums, values)

    if (isNumberFrameData(values))
        return new NumberKeyframeTrack(name, frameNums, values)
}

export const [addConfigAnimationDataSystem] = configSystemWithCleanUp(
    (self: AnimationManager) => {
        if (!self.data) {
            self.$clip = self.$loadedClip
            self.audioTotalFrames = 0
            return
        }
        const audioDurationGetters: Array<GetGlobalState<number>> = []
        self.$clip = new AnimationClip(
            undefined,
            undefined,
            Object.entries(self.data)
                .map(([targetName, targetTracks]) => {
                    const instance = uuidMap.get(targetName)
                    if (!instance) return []
                    if (instance instanceof TimelineAudio) {
                        audioDurationGetters.push(instance.durationState.get)
                        return []
                    }
                    return Object.entries(targetTracks)
                        .map(
                            ([property, frames]) =>
                                framesToKeyframeTrack(
                                    targetName,
                                    property,
                                    frames
                                )!
                        )
                        .filter(filterBoolean)
                })
                .flat()
        )
        const handle = new Cancellable()
        const computeAudioDuration = throttleTrailing(() => {
            if (handle.done) return
            const maxDuration = Math.max(
                ...audioDurationGetters.map((getter) => getter())
            )
            self.audioTotalFrames = Math.ceil(maxDuration * STANDARD_FRAME)
        })
        for (const getAudioDuration of audioDurationGetters)
            handle.watch(getAudioDuration(computeAudioDuration))

        return () => {
            handle.cancel()
        }
    }
)
