import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"
import ComponentIconPath from "./ComponentIconPath"

preventTreeShake(h)

const FindIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 1024 1024"
    >
        <ComponentIconPath />
    </svg>
  )
}

export default FindIcon
