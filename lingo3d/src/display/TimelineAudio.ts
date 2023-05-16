import { Reactive } from "@lincode/reactivity"
import Appendable from "./core/Appendable"
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

    private audio = new Audio()

    public constructor() {
        super()
        this.audio.ondurationchange = () =>
            (this.duration = this.audio.duration)
    }

    public srcState = new Reactive<string | undefined>(undefined)
    public get src() {
        return this.srcState.get()
    }
    public set src(value) {
        this.srcState.set(value)
        this.audio.src = value ?? ""
        this.duration = 0
    }

    public duration = 0
}
