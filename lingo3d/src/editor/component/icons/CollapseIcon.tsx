import { CSSProperties } from "preact/compat"
import { stopPropagation } from "../../utils/stopPropagation"

type CollapseIconProps = {
    style?: CSSProperties
    onClick?: () => void
}

const CollapseIcon = ({ style, onClick }: CollapseIconProps) => {
    return (
        <svg
            ref={stopPropagation}
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 1024 1024"
            style={{ margin: 2, flexShrink: 0, ...style }}
            onClick={onClick}
        >
            <path
                fill="#fff"
                d="M752 240H144c-17.7 0-32 14.3-32 32v608c0 17.7 14.3 32 32 32h608c17.7 0 32-14.3 32-32V272c0-17.7-14.3-32-32-32zM596 606c0 4.4-3.6 8-8 8H308c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h280c4.4 0 8 3.6 8 8v48zm284-494H264c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h576v576c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V144c0-17.7-14.3-32-32-32z"
            ></path>
        </svg>
    )
}

export default CollapseIcon
