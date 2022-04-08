import React from "react"
import { Sound as GameSound } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { SoundProps } from "../../Props"

const Sound = React.forwardRef<GameSound, SoundProps>((p, ref) => {
    const manager = useManager(p, ref, GameSound)
    return <ParentContext.Provider value={manager} />
})
export default Sound