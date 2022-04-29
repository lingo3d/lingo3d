import React from "react"
import { SkyLight as GameSkyLight } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { SkyLightProps } from "../../../Props"

const SkyLight = React.forwardRef<GameSkyLight, SkyLightProps>((p, ref) => {
    const manager = useManager(p, ref, GameSkyLight)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default SkyLight