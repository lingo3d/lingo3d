import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"
import ComponentIconPath from "./ComponentIconPath"

preventTreeShake(h)

const ComponentIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 1024 1024"
      style={{ margin: 2, opacity: 0.25, flexShrink: 0 }}
    >
      <ComponentIconPath />
    </svg>
  )
}

export default ComponentIcon
