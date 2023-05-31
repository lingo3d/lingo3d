import { filterBoolean } from "@lincode/utils"
import { AnimationClip, BooleanKeyframeTrack, NumberKeyframeTrack } from "three"
import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import { INVERSE_STANDARD_FRAME } from "../../globals"
import { FrameValue, FrameData } from "../../interface/IAnimationManager"
import { uuidMap } from "../../collections/idCollections"
import TimelineAudio from "../../display/TimelineAudio"
import createSystem from "../utils/createInternalSystem"

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

export const configAnimationDataSystem = createSystem(
    "configAnimationDataSystem",
    {
        effect: (self: AnimationManager) => {
            if (!self.data) {
                self.$clip = self.$loadedClip
                return
            }
            self.$clip = new AnimationClip(
                undefined,
                undefined,
                Object.entries(self.data)
                    .map(([uuid, tracks]) => {
                        const instance = uuidMap.get(uuid)
                        if (!instance || instance instanceof TimelineAudio)
                            return []
                        return Object.entries(tracks)
                            .map(
                                ([property, frames]) =>
                                    framesToKeyframeTrack(
                                        uuid,
                                        property,
                                        frames
                                    )!
                            )
                            .filter(filterBoolean)
                    })
                    .flat()
            )
        }
    }
)
