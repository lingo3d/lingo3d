import { keyPressSet } from "../../collections/keyPressSet"
import Keyboard from "../../display/Keyboard"
import { onKeyUp } from "../../events/onKeyUp"
import { LingoKeyboardEvent } from "../../interface/IKeyboard"
import eventSystem from "../utils/eventSystem"

export const keyUpSystem = eventSystem(
    "keyUpSystem",
    (keyboard: Keyboard, key: string) =>
        keyboard.onKeyUp?.(new LingoKeyboardEvent(key, keyPressSet)),
    onKeyUp
)
