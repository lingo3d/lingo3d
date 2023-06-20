import { keyPressSet } from "../../collections/keyPressSet"
import Keyboard from "../../display/Keyboard"
import { onKeyUp } from "../../events/onKeyUp"
import { LingoKeyboardEvent } from "../../interface/IKeyboard"
import createInternalSystem from "../utils/createInternalSystem"

export const keyUpSystem = createInternalSystem("keyUpSystem", {
    update: (keyboard: Keyboard, _, key) =>
        keyboard.onKeyUp?.(new LingoKeyboardEvent(key, keyPressSet)),
    updateTicker: onKeyUp
})
