import React from "react"
import { Dummy as GameDummy } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { DummyProps } from "../../Props"

const Dummy = React.forwardRef<GameDummy, DummyProps>((p, ref) => {
    const manager = useManager(p, ref, GameDummy)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default Dummy