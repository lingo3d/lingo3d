import React from "react"
import { FirstPersonCamera as GameFirstPersonCamera } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { FirstPersonCameraProps } from "../../../Props"

const FirstPersonCamera = React.forwardRef<GameFirstPersonCamera, FirstPersonCameraProps>((p, ref) => {
    const manager = useManager(p, ref, GameFirstPersonCamera)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default FirstPersonCamera