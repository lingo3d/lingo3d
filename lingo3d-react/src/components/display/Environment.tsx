import React from "react"
import { Environment as GameEnvironment } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { EnvironmentProps } from "../../Props"

const Environment = React.forwardRef<GameEnvironment, EnvironmentProps>((p, ref) => {
    const manager = useManager(p, ref, GameEnvironment)
    return <ParentContext.Provider value={manager} />
})

export default Environment