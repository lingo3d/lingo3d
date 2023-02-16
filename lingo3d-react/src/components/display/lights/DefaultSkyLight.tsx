import React from "react"
import { DefaultSkyLight as GameDefaultSkyLight } from "lingo3d"
import useManager, { ParentContext } from "../../../hooks/useManager"
import { DefaultSkyLightProps } from "../../../props/DefaultSkyLightProps"

const DefaultSkyLight = React.forwardRef<
  GameDefaultSkyLight,
  DefaultSkyLightProps
>((p, ref) => {
  const manager = useManager(p, ref, GameDefaultSkyLight)
  return (
    <ParentContext.Provider value={manager}>
      {p.children}
    </ParentContext.Provider>
  )
})

export default DefaultSkyLight
