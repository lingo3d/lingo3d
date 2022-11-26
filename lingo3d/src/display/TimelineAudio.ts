import { Cancellable } from "@lincode/promiselikes"
import { Reactive } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import {
    timelineAudioDefaults,
    timelineAudioSchema
} from "../interface/ITimelineAudio"

export default class TimelineAudio extends Appendable {
    public static componentName = "timelineAudio"
    public static defaults = timelineAudioDefaults
    public static schema = timelineAudioSchema

    public constructor(public name: string) {
        super()

        this.createEffect(() => {
            const src = this.srcState.get()
            const container = this.containerState.get()
            if (!src || !container) return

            const handle = new Cancellable()
            import("wavesurfer.js").then(({ default: WaveSurfer }) => {
                if (handle.done) return
                const wavesurfer = WaveSurfer.create({
                    container,
                    waveColor: "violet",
                    progressColor: "purple"
                })
                wavesurfer.load(src)
                handle.then(() => {
                    wavesurfer.destroy()
                })
            })
            return () => {
                handle.cancel()
            }
        }, [this.srcState.get, this.containerState.get])
    }

    private containerState = new Reactive<HTMLDivElement | undefined>(undefined)
    public mount(el: HTMLDivElement) {
        this.containerState.set(el)
    }

    private srcState = new Reactive<string | undefined>(undefined)
    public get src() {
        return this.srcState.get()
    }
    public set src(value) {
        this.srcState.set(value)
    }
}
