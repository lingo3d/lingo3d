import React from "react"
import { Plane as GamePlane } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { PlaneProps } from "../../../props/PlaneProps"

const Plane = React.forwardRef<GamePlane, PlaneProps>((p, ref) => {
  const manager = useManager(p, ref, GamePlane)
  return (
    <ParentContext.Provider value={manager}>
      {p.children}
    </ParentContext.Provider>
  )
})

export default Plane
