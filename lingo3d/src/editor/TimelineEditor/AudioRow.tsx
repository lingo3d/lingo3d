import { Cancellable } from "@lincode/promiselikes"
import { memo } from "preact/compat"
import { useLayoutEffect, useRef, useState } from "preact/hooks"
import TimelineAudio from "../../display/TimelineAudio"
import { FRAME_HEIGHT, SEC2FRAME, FRAME_WIDTH, FRAME2SEC } from "../../globals"
import { getTimelineFrame } from "../states/useTimelineFrame"
import { useTimelinePaused } from "../states/useTimelinePaused"
import WaveSurfer from "wavesurfer.js"
import { getTimeline } from "../states/useTimeline"
import getPrivateValue from "../../utils/getPrivateValue"
import diffProps from "../utils/diffProps"
import useSyncState from "../hooks/useSyncState"

type AudioRowProps = {
    instance: TimelineAudio
    startFrame: number
}

const AudioRow = ({ instance, startFrame }: AudioRowProps) => {
    const src = useSyncState(getPrivateValue(instance, "srcState").get)
    const duration = useSyncState(
        getPrivateValue(instance, "durationState").get
    )
    const width = duration * SEC2FRAME * FRAME_WIDTH
    const ref = useRef<HTMLDivElement>(null)
    const [waveSurfer, setWaveSurfer] = useState<WaveSurfer>()
    const [paused] = useTimelinePaused()

    useLayoutEffect(() => {
        if (!waveSurfer) return
        if (!paused) {
            const handle = getTimelineFrame((frame, handle) => {
                if (frame < startFrame) return
                waveSurfer.play((frame - startFrame) * FRAME2SEC)
                handle.cancel()
            })
            let awaitCount = 1
            const timeline = getTimeline()!
            timeline.await += awaitCount

            const audioContext = waveSurfer.backend.getAudioContext()
            const timeout = setTimeout(() => {
                timeline.await -= awaitCount
                awaitCount = 0
            }, (audioContext.baseLatency + audioContext.outputLatency) * 1000)

            return () => {
                clearTimeout(timeout)
                waveSurfer.pause()
                timeline.await -= awaitCount
                handle.cancel()
            }
        }
        const handle = getTimelineFrame((frame) => {
            waveSurfer.setCurrentTime(
                Math.max(frame - startFrame, 0) * FRAME2SEC
            )
        })
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
                waveColor: "magenta",
                progressColor: "magenta",
                // progressColor: "rgb(63, 0, 63)",
                height: FRAME_HEIGHT
            })
            handle.then(() => waveSurfer.destroy())
            waveSurfer.load(src)
            setWaveSurfer(waveSurfer)
        })
        return () => {
            handle.cancel()
            setWaveSurfer(undefined)
        }
    }, [src, width])

    return <div ref={ref} style={{ width, left: startFrame * FRAME_WIDTH }} />
}

export default memo(AudioRow, diffProps)
