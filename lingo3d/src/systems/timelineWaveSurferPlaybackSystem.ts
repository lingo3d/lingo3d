import WaveSurfer from "wavesurfer.js"
import { timelineFramePtr } from "../pointers/timelineFramePtr"
import { INVERSE_STANDARD_FRAME } from "../globals"
import createInternalSystem from "./utils/createInternalSystem"

export const timelineWaveSurferPlaybackSystem = createInternalSystem(
    "timelineWaveSurferPlaybackSystem",
    {
        data: {} as { startFrame: number },
        update: (self: WaveSurfer, data) => {
            if (timelineFramePtr[0] < data.startFrame) return
            self.play(
                (timelineFramePtr[0] - data.startFrame) * INVERSE_STANDARD_FRAME
            )
            timelineWaveSurferPlaybackSystem.delete(self)
        }
    }
)
