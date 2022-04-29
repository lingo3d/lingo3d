import React from "react"
import { DirectionalLight as GameDirectionalLight } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { DirectionalLightProps } from "../../../Props"

const DirectionalLight = React.forwardRef<GameDirectionalLight, DirectionalLightProps>((p, ref) => {
    const manager = useManager(p, ref, GameDirectionalLight)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default DirectionalLight