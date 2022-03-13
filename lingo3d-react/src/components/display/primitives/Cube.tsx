import React from "react"
import { Cube as GameCube } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { PrimitiveProps } from "../../../Props"

const Cube = React.forwardRef<GameCube, PrimitiveProps>((p, ref) => {
    const manager = useManager(p, ref, GameCube)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default Cube