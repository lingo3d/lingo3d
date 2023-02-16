import React from "react"
import { Cone as GameCone } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { ConeProps } from "../../../props/ConeProps"

const Cone = React.forwardRef<GameCone, ConeProps>((p, ref) => {
  const manager = useManager(p, ref, GameCone)
  return (
    <ParentContext.Provider value={manager}>
      {p.children}
    </ParentContext.Provider>
  )
})

export default Cone
