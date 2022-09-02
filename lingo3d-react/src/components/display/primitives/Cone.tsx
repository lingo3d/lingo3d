import React from "react"
import { Cone as GameCone } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { PrimitiveProps } from "../../../props/PrimitiveProps"

const Cone = React.forwardRef<GameCone, PrimitiveProps>((p, ref) => {
  const manager = useManager(p, ref, GameCone)
  return (
    <ParentContext.Provider value={manager}>
      {p.children}
    </ParentContext.Provider>
  )
})

export default Cone
