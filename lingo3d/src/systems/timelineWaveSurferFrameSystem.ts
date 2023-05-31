import WaveSurfer from "wavesurfer.js"
import { timelineFramePtr } from "../pointers/timelineFramePtr"
import { INVERSE_STANDARD_FRAME } from "../globals"
import createSystem from "./utils/createInternalSystem"

export const timelineWaveSurferFrameSystem = createSystem(
    "timelineWaveSurferFrameSystem",
    {
        data: {} as { frame: number; startFrame: number },
        update: (self: WaveSurfer, data) => {
            if (data.frame === timelineFramePtr[0]) return
            data.frame = timelineFramePtr[0]
            self.setCurrentTime(
                Math.max(data.frame - data.startFrame, 0) *
                    INVERSE_STANDARD_FRAME
            )
        }
    }
)
