import useResizeObserver from "../hooks/useResizeObserver"
import FrameGrid from "./FrameGrid"

type FrameGridProps = {}

const Frames = ({}: FrameGridProps) => {
    const [ref, { width }] = useResizeObserver()

    return (
        <div
            ref={ref}
            className="lingo3d-absfull"
            style={{
                display: "flex",
                flexDirection: "column",
                borderTop: "1px solid rgba(255, 255, 255, 0.2)"
            }}
        >
            <FrameGrid width={width} />
            <FrameGrid width={width} />
            <FrameGrid width={width} />
        </div>
    )
}

export default Frames
