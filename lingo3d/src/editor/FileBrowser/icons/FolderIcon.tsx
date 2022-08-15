import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"

preventTreeShake(h)

function FolderIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="35"
            className="icon"
            viewBox="0 0 1024 1024"
        >
            <path
                fill="#4A9ED8"
                d="M913.959 292.75L612.255 11.244A41.643 41.643 0 00583.938 0h-445.58a41.643 41.643 0 00-41.642 41.643v940.714A41.643 41.643 0 00138.359 1024H885.64a41.643 41.643 0 0041.643-41.643V323.15a41.643 41.643 0 00-13.325-30.4zm-70.793 62.464a41.643 41.643 0 01-41.643 41.643H593.308a41.643 41.643 0 01-41.643-41.643V147a41.643 41.643 0 1183.286 0V313.57h166.572a41.643 41.643 0 0141.643 41.643z"
            ></path>
        </svg>
    )
}

export default FolderIcon
