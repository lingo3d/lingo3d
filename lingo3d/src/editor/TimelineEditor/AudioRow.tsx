import { memo } from "preact/compat"
import { useEffect, useState } from "preact/hooks"
import TimelineAudio from "../../display/TimelineAudio"
import { FRAME_HEIGHT } from "../../globals"
import WaveSurfer from "../component/WaveSurfer"

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

    return (
        <div
            style={{
                height: FRAME_HEIGHT,
                width: 5000
            }}
        >
            <WaveSurfer src={src} />
        </div>
    )
}

export default memo(AudioRow, (prev, next) => prev.instance === next.instance)
