import React from "react"
import { Reflector as GameReflector } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { ReflectorProps } from "../../Props"

const Reflector = React.forwardRef<GameReflector, ReflectorProps>((p, ref) => {
    const manager = useManager(p, ref, GameReflector)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default Reflector