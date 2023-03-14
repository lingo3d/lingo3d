import { Cancellable } from "@lincode/promiselikes"
import { memo } from "preact/compat"
import { useLayoutEffect, useMemo, useRef, useState } from "preact/hooks"
import TimelineAudio from "../../display/TimelineAudio"
import {
    FRAME_HEIGHT,
    STANDARD_FRAME,
    FRAME_WIDTH,
    INVERSE_STANDARD_FRAME
} from "../../globals"
import { getTimelineFrame } from "../../states/useTimelineFrame"
import { getTimelinePaused } from "../../states/useTimelinePaused"
import WaveSurfer from "wavesurfer.js"
import diffProps from "../utils/diffProps"
import useSyncState from "../hooks/useSyncState"
import { getTimeline } from "../../states/useTimeline"
import { getTimelineMute } from "../../states/useTimelineMute"

type AudioRowProps = {
    instance: TimelineAudio
    frames: Record<number, true>
}

const AudioRow = ({ instance, frames }: AudioRowProps) => {
    const src = useSyncState(instance.srcState.get)
    const duration = useSyncState(instance.durationState.get)
    const frameKeys = useMemo(() => Object.keys(frames), [frames])
    const [startFrame, endFrame] = useMemo(() => {
        const startFrame = Number(frameKeys[0] ?? 0)
        return [
            startFrame,
            frameKeys.length < 2
                ? startFrame + Math.ceil(duration * STANDARD_FRAME)
                : Number(frameKeys.at(-1))
        ]
    }, [frameKeys, duration])

    const width = endFrame * FRAME_WIDTH
    const ref = useRef<HTMLDivElement>(null)
    const [waveSurfer, setWaveSurfer] = useState<WaveSurfer>()
    const paused = useSyncState(getTimelinePaused)
    const timeline = useSyncState(getTimeline)

    useLayoutEffect(() => {
        if (!duration || frameKeys.length >= 2 || !timeline) return

        timeline.mergeData({
            [instance.uuid]: {
                frames: { 0: 0, [endFrame]: 0 }
            }
        })
    }, [duration, frameKeys, timeline, endFrame])

    useLayoutEffect(() => {
        if (!waveSurfer || !timeline) return
        if (!paused) {
            const handle = getTimelineFrame((frame, handle) => {
                if (frame < startFrame) return
                waveSurfer.play((frame - startFrame) * INVERSE_STANDARD_FRAME)
                handle.cancel()
            })
            let awaitCount = 1
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
                Math.max(frame - startFrame, 0) * INVERSE_STANDARD_FRAME
            )
        })
        return () => {
            handle.cancel()
        }
    }, [waveSurfer, paused, timeline])

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
            handle.watch(getTimelineMute((val) => waveSurfer.setMute(val)))
        })
        return () => {
            handle.cancel()
            setWaveSurfer(undefined)
        }
    }, [src, width])

    return <div ref={ref} style={{ width, left: startFrame * FRAME_WIDTH }} />
}

export default memo(AudioRow, diffProps)
