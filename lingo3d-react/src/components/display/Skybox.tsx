import React from "react"
import { Skybox as GameSkybox } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { SkyboxProps } from "../../props/SkyboxProps"

const Skybox = React.forwardRef<GameSkybox, SkyboxProps>((p, ref) => {
  const manager = useManager(p, ref, GameSkybox)
  return <ParentContext.Provider value={manager} />
})

export default Skybox
