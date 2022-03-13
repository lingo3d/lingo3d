import React from "react"
import { Scene as GameScene } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { SceneProps } from "../../Props"

export const SceneContext = React.createContext<GameScene | undefined>(undefined)

const Scene = React.forwardRef<GameScene, SceneProps>((p, ref) => {
    const manager = useManager(p, ref, GameScene)
    return (
        <SceneContext.Provider value={manager}>
            <ParentContext.Provider value={manager}>
                {p.children}
            </ParentContext.Provider>
        </SceneContext.Provider>
    )
})

export default Scene