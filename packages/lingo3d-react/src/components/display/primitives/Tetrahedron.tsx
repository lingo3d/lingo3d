import React from "react"
import { Tetrahedron as GameTetrahedron } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { PrimitiveProps } from "../../../Props"

const Tetrahedron = React.forwardRef<GameTetrahedron, PrimitiveProps>((p, ref) => {
    const manager = useManager(p, ref, GameTetrahedron)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default Tetrahedron