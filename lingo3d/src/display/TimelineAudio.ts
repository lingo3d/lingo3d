import Appendable from "../api/core/Appendable"
import {
    timelineAudioDefaults,
    timelineAudioSchema
} from "../interface/ITimelineAudio"

export default class TimelineAudio extends Appendable {
    public static componentName = "timelineAudio"
    public static defaults = timelineAudioDefaults
    public static schema = timelineAudioSchema

    public name?: string

    public constructor() {
        super()
    }
}
