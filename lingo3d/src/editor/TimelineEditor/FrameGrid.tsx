import { memo } from "preact/compat"
import { FRAME_WIDTH, FRAME_HEIGHT } from "../../globals"
import { returnTrue } from "../../display/utils/reusables"

const FrameGrid = () => {
    return (
        <svg
            className="lingo3d-absfull"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern
                    id="smallGrid"
                    width={FRAME_WIDTH}
                    height={FRAME_HEIGHT}
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d={`M ${FRAME_WIDTH} 0 L 0 0 0 ${FRAME_HEIGHT}`}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.2)"
                        stroke-width="0.5"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>
    )
}

export default memo(FrameGrid, returnTrue)
