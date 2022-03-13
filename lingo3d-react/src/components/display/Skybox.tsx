import React from "react"
import { Skybox as GameSkybox } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { SkyboxProps } from "../../Props"

const Skybox = React.forwardRef<GameSkybox, SkyboxProps>((p, ref) => {
    const manager = useManager(p, ref, GameSkybox)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default Skybox