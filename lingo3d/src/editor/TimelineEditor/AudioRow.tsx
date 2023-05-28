import { Cancellable } from "@lincode/promiselikes"
import { memo } from "preact/compat"
import { useLayoutEffect, useMemo, useRef, useState } from "preact/hooks"
import TimelineAudio from "../../display/TimelineAudio"
import { FRAME_HEIGHT, STANDARD_FRAME, FRAME_WIDTH } from "../../globals"
import { getTimelinePaused } from "../../states/useTimelinePaused"
import WaveSurfer from "wavesurfer.js"
import diffProps from "../utils/diffProps"
import useSyncState from "../hooks/useSyncState"
import { getTimeline } from "../../states/useTimeline"
import { getTimelineMute } from "../../states/useTimelineMute"
import getReactive from "../../utils/getReactive"
import { timelineFramePtr } from "../../pointers/timelineFramePtr"
import { timelineWaveSurferFrameSystem } from "../../systems/timelineWaveSurferFrameSystem"
import { timelineWaveSurferPlaybackSystem } from "../../systems/timelineWaveSurferPlaybackSystem"

type AudioRowProps = {
    instance: TimelineAudio
    frames: Record<number, true>
}

const AudioRow = ({ instance, frames }: AudioRowProps) => {
    const src = useSyncState(instance.srcState.get)
    const durationReactive = useMemo(
        () => getReactive(instance, "duration"),
        []
    )
    const duration = useSyncState(durationReactive.get)
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
            timelineWaveSurferPlaybackSystem.add(waveSurfer, { startFrame })

            let pausedCount = 1
            timeline.$animationStates.pausedCount += pausedCount

            const audioContext = waveSurfer.backend.getAudioContext()
            const timeout = setTimeout(() => {
                timeline.$animationStates.pausedCount -= pausedCount
                pausedCount = 0
            }, (audioContext.baseLatency + audioContext.outputLatency) * 1000)

            return () => {
                timelineWaveSurferPlaybackSystem.delete(waveSurfer)
                clearTimeout(timeout)
                waveSurfer.pause()
                timeline.$animationStates.pausedCount -= pausedCount
            }
        }
        timelineWaveSurferFrameSystem.add(waveSurfer, {
            frame: timelineFramePtr[0],
            startFrame
        })
        return () => {
            timelineWaveSurferFrameSystem.delete(waveSurfer)
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
