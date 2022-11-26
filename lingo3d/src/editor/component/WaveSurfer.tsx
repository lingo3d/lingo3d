import { Cancellable } from "@lincode/promiselikes"
import { useEffect, useRef } from "preact/hooks"
import { FRAME_HEIGHT } from "../../globals"

type WaveSurferProps = {
    src?: string
}

const WaveSurfer = ({ src }: WaveSurferProps) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const div = ref.current
        if (!div || !src) return

        const handle = new Cancellable()
        import("wavesurfer.js").then(({ default: WaveSurfer }) => {
            if (handle.done) return
            const wavesurfer = WaveSurfer.create({
                container: div,
                waveColor: "violet",
                progressColor: "purple",
                height: FRAME_HEIGHT
            })
            wavesurfer.load(src)

            const listener = wavesurfer.once("ready", () => {
                console.log("ready")
            })
            handle.then(() => {
                wavesurfer.destroy()
                listener.un()
            })
        })
        return () => {
            handle.cancel()
        }
    }, [src])
    
    return (
        <div ref={ref} />
    )
}

export default WaveSurfer
