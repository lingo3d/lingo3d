import React from "react"
import { Circle as GameCircle } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { CircleProps } from "../../../props/CircleProps"

const Circle = React.forwardRef<GameCircle, CircleProps>((p, ref) => {
  const manager = useManager(p, ref, GameCircle)
  return (
    <ParentContext.Provider value={manager}>
      {p.children}
    </ParentContext.Provider>
  )
})

export default Circle
