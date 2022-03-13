import React from "react"
import { Keyboard as GameKeyboard } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { KeyboardProps } from "../../Props"

const Keyboard = React.forwardRef<GameKeyboard, KeyboardProps>((p, ref) => {
    const manager = useManager(p, ref, GameKeyboard)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default Keyboard