import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"

preventTreeShake(h)

const ExportIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      className="icon"
      viewBox="0 0 1024 1024"
    >
      <path
        fill="#fff"
        d="M512 128l184 192H544v448h-64V320H328l184-192zm384 384h-64v320H192V512h-64v384h768V512z"
      ></path>
    </svg>
  )
}

export default ExportIcon
