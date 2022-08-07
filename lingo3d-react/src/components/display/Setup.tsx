import React from "react"
import { Setup as GameSetup } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { SetupProps } from "../../props"

const Setup = React.forwardRef<GameSetup, SetupProps>((p, ref) => {
  const manager = useManager(p, ref, GameSetup)
  return <ParentContext.Provider value={manager} />
})

export default Setup
