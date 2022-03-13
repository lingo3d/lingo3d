import React from "react"
import { SpotLight as GameSpotLight } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { SpotLightProps } from "../../../Props"

const SpotLight = React.forwardRef<GameSpotLight, SpotLightProps>((p, ref) => {
    const manager = useManager(p, ref, GameSpotLight)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default SpotLight