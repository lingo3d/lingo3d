import React from "react"
import { AmbientLight as GameAmbientLight } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { AmbientLightProps } from "../../../Props"

const AmbientLight = React.forwardRef<GameAmbientLight, AmbientLightProps>((p, ref) => {
    const manager = useManager(p, ref, GameAmbientLight)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default AmbientLight