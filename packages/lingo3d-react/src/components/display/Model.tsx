import React from "react"
import { Model as GameModel } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { ModelProps } from "../../Props"

const Model = React.forwardRef<GameModel, ModelProps>((p, ref) => {
    const manager = useManager(p, ref, GameModel)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default Model