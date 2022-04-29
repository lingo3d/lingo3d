import React from "react"
import { Torus as GameTorus } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { PrimitiveProps } from "../../../Props"

const Torus = React.forwardRef<GameTorus, PrimitiveProps>((p, ref) => {
    const manager = useManager(p, ref, GameTorus)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default Torus