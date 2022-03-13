import React from "react"
import { Group as GameGroup } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { ManagerProps } from "../../Props"

const Group = React.forwardRef<GameGroup, ManagerProps>((p, ref) => {
    const manager = useManager(p, ref, GameGroup)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default Group