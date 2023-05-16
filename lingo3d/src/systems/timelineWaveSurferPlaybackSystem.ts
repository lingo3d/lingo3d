import WaveSurfer from "wavesurfer.js"
import { timelineFramePtr } from "../pointers/timelineFramePtr"
import renderSystemWithData from "./utils/renderSystemWithData"
import { INVERSE_STANDARD_FRAME } from "../globals"

export const [
    addTimelineWaveSurferPlaybackSystem,
    deleteTimelineWaveSurferPlaybackSystem
] = renderSystemWithData((self: WaveSurfer, data: { startFrame: number }) => {
    if (timelineFramePtr[0] < data.startFrame) return
    self.play((timelineFramePtr[0] - data.startFrame) * INVERSE_STANDARD_FRAME)
    deleteTimelineWaveSurferPlaybackSystem(self)
})
