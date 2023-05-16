import WaveSurfer from "wavesurfer.js"
import renderSystemWithData from "./utils/renderSystemWithData"
import { timelineFramePtr } from "../pointers/timelineFramePtr"
import { INVERSE_STANDARD_FRAME } from "../globals"

export const [
    addTimelineWaveSurferFrameSystem,
    deleteTimelineWaveSurferFrameSystem
] = renderSystemWithData(
    (self: WaveSurfer, data: { frame: number; startFrame: number }) => {
        if (data.frame === timelineFramePtr[0]) return
        data.frame = timelineFramePtr[0]
        self.setCurrentTime(
            Math.max(data.frame - data.startFrame, 0) * INVERSE_STANDARD_FRAME
        )
    }
)
