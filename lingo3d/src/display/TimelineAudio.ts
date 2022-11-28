import { Reactive } from "@lincode/reactivity"
import { PropertyBinding } from "three"
import Appendable from "../api/core/Appendable"
import { emitName } from "../events/onName"
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

    public constructor() {
        super()
    }

    public get name() {
        return this.outerObject3d.name
    }
    public set name(val) {
        this.outerObject3d.name = PropertyBinding.sanitizeNodeName(val)
        emitName(this)
    }

    private srcState = new Reactive<string | undefined>(undefined)
    public get src() {
        return this.srcState.get()
    }
    public set src(value) {
        this.srcState.set(value)
    }

    private startFrameState = new Reactive(0)
    public get startFrame() {
        return this.startFrameState.get()
    }
    public set startFrame(val) {
        this.startFrameState.set(val)
    }
}
