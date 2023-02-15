import React from "react"
import { SpriteSheet as GameSpriteSheet } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { SpriteSheetProps } from "../../props/SpriteSheetProps"

const SpriteSheet = React.forwardRef<GameSpriteSheet, SpriteSheetProps>(
  (p, ref) => {
    const manager = useManager(p, ref, GameSpriteSheet)
    return (
      <ParentContext.Provider value={manager}>
        {p.children}
      </ParentContext.Provider>
    )
  }
)

export default SpriteSheet
