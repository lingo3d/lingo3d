import React from "react"
import { SpawnPoint as GameSpawnPoint } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { ManagerProps } from "../../props"

const SpawnPoint = React.forwardRef<GameSpawnPoint, ManagerProps>((p, ref) => {
  const manager = useManager(p, ref, GameSpawnPoint)
  return (
    <ParentContext.Provider value={manager}>
      {p.children}
    </ParentContext.Provider>
  )
})

export default SpawnPoint
