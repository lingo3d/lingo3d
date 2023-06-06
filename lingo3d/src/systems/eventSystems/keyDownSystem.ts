import { keyPressSet } from "../../collections/keyPressSet"
import Keyboard from "../../display/Keyboard"
import { onKeyDown } from "../../events/onKeyDown"
import { LingoKeyboardEvent } from "../../interface/IKeyboard"
import eventSystem from "../utils/eventSystem"

export const [addKeyDownSystem, deleteKeyDownSystem] = eventSystem(
    "keyDownSystem",
    (keyboard: Keyboard, key: string) =>
        keyboard.onKeyDown?.(new LingoKeyboardEvent(key, keyPressSet)),
    onKeyDown
)
