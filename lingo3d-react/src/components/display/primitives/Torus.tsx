import React from "react"
import { Torus as GameTorus } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { TorusProps } from "../../../props/TorusProps"

const Torus = React.forwardRef<GameTorus, TorusProps>((p, ref) => {
  const manager = useManager(p, ref, GameTorus)
  return (
    <ParentContext.Provider value={manager}>
      {p.children}
    </ParentContext.Provider>
  )
})

export default Torus
