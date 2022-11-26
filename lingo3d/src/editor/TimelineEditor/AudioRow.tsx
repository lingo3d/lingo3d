import { Cancellable } from "@lincode/promiselikes"
import { memo } from "preact/compat"
import { useEffect, useRef, useState } from "preact/hooks"
import TimelineAudio from "../../display/TimelineAudio"
import { FRAME_HEIGHT, SEC2FRAME, FRAME_WIDTH } from "../../globals"
import { getTimelineFrame } from "../states/useTimelineFrame"

type AudioRowProps = {
    instance: TimelineAudio
}

const AudioRow = ({ instance }: AudioRowProps) => {
    const [src, setSrc] = useState<string>()

    useEffect(() => {
        //@ts-ignore
        const handle = instance.srcState.get(setSrc)
        return () => {
            handle.cancel()
        }
    }, [instance])

    const ref = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(0)

    useEffect(() => {
        const div = ref.current
        if (!div || !src || !width) return

        const handle = new Cancellable()
        import("wavesurfer.js").then(({ default: WaveSurfer }) => {
            if (handle.done) return
            const wavesurfer = WaveSurfer.create({
                container: div,
                // waveColor: "violet",
                // progressColor: "purple",
                height: FRAME_HEIGHT
            })
            wavesurfer.load(src)

            const handle2 = getTimelineFrame((frame) => {
                console.log(frame)
            })

            handle.then(() => {
                wavesurfer.destroy()
                handle2.cancel()
            })
        })
        return () => {
            handle.cancel()
            setWidth(0)
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
