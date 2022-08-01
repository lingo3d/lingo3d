import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"

preventTreeShake(h)

const NoneIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            className="icon"
            viewBox="0 0 1024 1024"
        >
            <path
                fill="#fff"
                d="M512 85.333c235.648 0 426.667 191.019 426.667 426.667S747.648 938.667 512 938.667 85.333 747.648 85.333 512 276.352 85.333 512 85.333zm278.059 193.835l-510.891 510.89a362.667 362.667 0 00510.89-510.89zM512 149.333a362.667 362.667 0 00-278.059 595.499l510.891-510.89A361.216 361.216 0 00512 149.332z"
            ></path>
        </svg>
    )
}

export default NoneIcon
