import { Cancellable } from "@lincode/promiselikes"
import { useEffect, useRef, useState } from "preact/hooks"
import { FRAME_HEIGHT, FRAME_WIDTH, SEC2FRAME } from "../../globals"

type WaveSurferProps = {
    src?: string
}

const WaveSurfer = ({ src }: WaveSurferProps) => {
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
            handle.then(() => wavesurfer.destroy())
            wavesurfer.load(src)
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

export default WaveSurfer
