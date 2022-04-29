import React from "react"
import { Octahedron as GameOctahedron } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { PrimitiveProps } from "../../../Props"

const Octahedron = React.forwardRef<GameOctahedron, PrimitiveProps>((p, ref) => {
    const manager = useManager(p, ref, GameOctahedron)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default Octahedron