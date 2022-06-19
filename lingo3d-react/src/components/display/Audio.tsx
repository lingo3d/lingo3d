import React from "react"
import { Audio as GameAudio } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { AudioProps } from "../../Props"

const Audio = React.forwardRef<GameAudio, AudioProps>((p, ref) => {
    const manager = useManager(p, ref, GameAudio)
    return <ParentContext.Provider value={manager} />
})

export default Audio