import React from "react"
import { Mouse as GameMouse } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { MouseProps } from "../../Props"

const Mouse = React.forwardRef<GameMouse, MouseProps>((p, ref) => {
    const manager = useManager(p, ref, GameMouse)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default Mouse