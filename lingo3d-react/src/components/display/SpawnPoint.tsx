import React from "react"
import { SpawnPoint as GameSpawnPoint } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { SpawnPointProps } from "../../props"

const SpawnPoint = React.forwardRef<GameSpawnPoint, SpawnPointProps>(
  (p, ref) => {
    const manager = useManager(p, ref, GameSpawnPoint)
    return (
      <ParentContext.Provider value={manager}>
        {p.children}
      </ParentContext.Provider>
    )
  }
)

export default SpawnPoint
