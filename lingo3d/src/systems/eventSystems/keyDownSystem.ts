import { keyPressSet } from "../../collections/keyPressSet"
import Keyboard from "../../display/Keyboard"
import { onKeyDown } from "../../events/onKeyDown"
import { LingoKeyboardEvent } from "../../interface/IKeyboard"
import createInternalSystem from "../utils/createInternalSystem"

export const keyDownSystem = createInternalSystem("keyDownSystem", {
    update: (keyboard: Keyboard, _, key) =>
        keyboard.onKeyDown?.(new LingoKeyboardEvent(key, keyPressSet)),
    updateTicker: onKeyDown
})
