import React from "react"
import { Sprite as GameSprite } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { SpriteProps } from "../../Props"

const Sprite = React.forwardRef<GameSprite, SpriteProps>((p, ref) => {
    const manager = useManager(p, ref, GameSprite)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default Sprite