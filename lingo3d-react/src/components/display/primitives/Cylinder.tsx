import React from "react"
import { Cylinder as GameCylinder } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { PrimitiveProps } from "../../../Props"

const Cylinder = React.forwardRef<GameCylinder, PrimitiveProps>((p, ref) => {
    const manager = useManager(p, ref, GameCylinder)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default Cylinder