import React from "react"
import { Trigger as GameTrigger } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { TriggerProps } from "../../props"

const Trigger = React.forwardRef<GameTrigger, TriggerProps>((p, ref) => {
    const manager = useManager(p, ref, GameTrigger)
    return <ParentContext.Provider value={manager} />
})
export default Trigger