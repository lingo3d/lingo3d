import React from "react"
import { Scene as GameScene } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { SceneProps } from "../../Props"

const Scene = React.forwardRef<GameScene, SceneProps>((p, ref) => {
    const manager = useManager(p, ref, GameScene)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default Scene