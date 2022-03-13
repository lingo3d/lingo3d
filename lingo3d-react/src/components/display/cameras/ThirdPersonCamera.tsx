import React from "react"
import { ThirdPersonCamera as GameThirdPersonCamera } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { ThirdPersonCameraProps } from "../../../Props"

const ThirdPersonCamera = React.forwardRef<GameThirdPersonCamera, ThirdPersonCameraProps>((p, ref) => {
    const manager = useManager(p, ref, GameThirdPersonCamera)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default ThirdPersonCamera