import WaveSurfer from "wavesurfer.js"
import { timelineFramePtr } from "../pointers/timelineFramePtr"
import { INVERSE_STANDARD_FRAME } from "../globals"
import gameSystem from "./utils/gameSystem"

export const timelineWaveSurferFrameSystem = gameSystem({
    data: {} as { frame: number; startFrame: number },
    update: (self: WaveSurfer, data) => {
        if (data.frame === timelineFramePtr[0]) return
        data.frame = timelineFramePtr[0]
        self.setCurrentTime(
            Math.max(data.frame - data.startFrame, 0) * INVERSE_STANDARD_FRAME
        )
    }
})
