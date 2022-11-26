import { memo } from "preact/compat"
import { useCallback } from "preact/hooks"
import TimelineAudio from "../../display/TimelineAudio"
import { FRAME_HEIGHT } from "../../globals"

type AudioRowProps = {
    instance: TimelineAudio
}

const AudioRow = ({ instance }: AudioRowProps) => {
    const setContainer = useCallback(
        (el: HTMLDivElement | null) => {
            if (!el) return
            instance.mount(el)
        },
        [instance]
    )
    return (
        <div
            ref={setContainer}
            style={{
                height: FRAME_HEIGHT,
                width: 5000
            }}
        />
    )
}

export default memo(AudioRow, (prev, next) => prev.instance === next.instance)
