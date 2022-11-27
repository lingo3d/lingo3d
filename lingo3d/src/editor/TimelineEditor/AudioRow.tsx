import { Cancellable } from "@lincode/promiselikes"
import { memo } from "preact/compat"
import { useLayoutEffect, useRef, useState } from "preact/hooks"
import TimelineAudio from "../../display/TimelineAudio"
import { FRAME_HEIGHT, SEC2FRAME, FRAME_WIDTH, FRAME2SEC } from "../../globals"
import { getTimelineFrame } from "../states/useTimelineFrame"
import { useTimelinePaused } from "../states/useTimelinePaused"
import WaveSurfer from "wavesurfer.js"
import { getTimeline } from "../states/useTimeline"
import unsafeGetValue from "../../utils/unsafeGetValue"

type AudioRowProps = {
    instance: TimelineAudio
}

const AudioRow = ({ instance }: AudioRowProps) => {
    const [src, setSrc] = useState<string>()

    useLayoutEffect(() => {
        const handle = unsafeGetValue(instance, "srcState").get(setSrc)
        return () => {
            handle.cancel()
        }
    }, [instance])

    const ref = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(0)
    const [waveSurfer, setWaveSurfer] = useState<WaveSurfer>()
    const [paused] = useTimelinePaused()

    useLayoutEffect(() => {
        if (!waveSurfer) return
        if (!paused) {
            waveSurfer.play(getTimelineFrame() * FRAME2SEC)

            let awaitCount = 1
            const timeline = getTimeline()!
            timeline.await += awaitCount

            const audioContext = waveSurfer.backend.getAudioContext()
            const timeout = setTimeout(() => {
                timeline.await -= awaitCount
                awaitCount = 0
            }, audioContext.baseLatency + audioContext.outputLatency * 1000)

            return () => {
                clearTimeout(timeout)
                waveSurfer.pause()
                timeline.await -= awaitCount
            }
        }
        const handle = getTimelineFrame((frame) =>
            waveSurfer.setCurrentTime(frame * FRAME2SEC)
        )
        return () => {
            handle.cancel()
        }
    }, [waveSurfer, paused])

    useLayoutEffect(() => {
        const div = ref.current
        if (!div || !src || !width) return

        const handle = new Cancellable()
        import("wavesurfer.js").then(({ default: WaveSurfer }) => {
            if (handle.done) return

            const waveSurfer = WaveSurfer.create({
                container: div,
                waveColor: "violet",
                progressColor: "purple",
                height: FRAME_HEIGHT
            })
            handle.then(() => waveSurfer.destroy())
            waveSurfer.load(src)
            setWaveSurfer(waveSurfer)
        })
        return () => {
            handle.cancel()
            setWidth(0)
            setWaveSurfer(undefined)
        }
    }, [src, width])

    return (
        <>
            <div ref={ref} style={{ width }} />
            <audio
                src={src}
                hidden
                onDurationChange={(e) =>
                    setWidth(e.currentTarget.duration * SEC2FRAME * FRAME_WIDTH)
                }
            />
        </>
    )
}

export default memo(AudioRow, (prev, next) => prev.instance === next.instance)
