import { Reactive } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import ITimelineAudio, {
    timelineAudioDefaults,
    timelineAudioSchema
} from "../interface/ITimelineAudio"

export default class TimelineAudio
    extends Appendable
    implements ITimelineAudio
{
    public static componentName = "timelineAudio"
    public static defaults = timelineAudioDefaults
    public static schema = timelineAudioSchema

    public name = ""

    private srcState = new Reactive<string | undefined>(undefined)
    public get src() {
        return this.srcState.get()
    }
    public set src(value) {
        this.srcState.set(value)
    }
}
