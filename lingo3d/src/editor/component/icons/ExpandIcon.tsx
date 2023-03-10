import { CSSProperties } from "preact/compat"
import { stopPropagation } from "../../utils/stopPropagation"

type ExpandIconProps = {
    style?: CSSProperties
    onClick?: () => void
}

const ExpandIcon = ({ style, onClick }: ExpandIconProps) => {
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
                d="M928.1 928.2H98v-830h830.1v830zm-104.8-415c0-24.6-19.9-44.5-44.5-44.5H556.5V246.4c0-24.6-19.9-44.5-44.5-44.5s-44.5 19.9-44.5 44.5v222.3H245.2c-24.6 0-44.5 19.9-44.5 44.5s19.9 44.5 44.5 44.5h222.3V780c0 24.6 19.9 44.5 44.5 44.5s44.5-19.9 44.5-44.5V557.7h222.3c24.6 0 44.5-20 44.5-44.5z"
            ></path>
        </svg>
    )
}

export default ExpandIcon
