import { keyPressSet } from "../../collections/keyPressSet"
import Keyboard from "../../display/Keyboard"
import { onKeyPress } from "../../events/onKeyPress"
import { LingoKeyboardEvent } from "../../interface/IKeyboard"
import createInternalSystem from "../utils/createInternalSystem"

export const keyPressSystem = createInternalSystem("keyPressSystem", {
    update: (keyboard: Keyboard) =>
        keyboard.onKeyPress?.(
            new LingoKeyboardEvent([...keyPressSet].at(-1) ?? "", keyPressSet)
        ),
    updateTicker: onKeyPress
})
