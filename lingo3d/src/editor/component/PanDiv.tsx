import { CSSProperties } from "preact/compat"
import usePan, { PanEvent } from "../hooks/usePan"

type Props = {
    style?: CSSProperties
    onPanStart?: (e: PanEvent) => void
    onPanEnd?: (e: PanEvent) => void
    onPan?: (e: PanEvent) => void
}

const PanDiv = ({ style, onPanStart, onPanEnd, onPan }: Props) => {
    const pressRef = usePan({ onPanStart, onPanEnd, onPan })
    return <div ref={pressRef} style={style} />
}
export default PanDiv
