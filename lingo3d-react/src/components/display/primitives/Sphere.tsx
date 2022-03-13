import React from "react"
import { Sphere as GameSphere } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { PrimitiveProps } from "../../../Props"

const Sphere = React.forwardRef<GameSphere, PrimitiveProps>((p, ref) => {
    const manager = useManager(p, ref, GameSphere)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default Sphere