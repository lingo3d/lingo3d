import { keyPressSet } from "../../collections/keyPressSet"
import Keyboard from "../../display/Keyboard"
import { onKeyPress } from "../../events/onKeyPress"
import { LingoKeyboardEvent } from "../../interface/IKeyboard"
import eventSystem from "../utils/eventSystem"

export const [addKeyPressSystem, deleteKeyPressSystem] = eventSystem<
    Keyboard,
    void
>(
    "keyPressSystem",
    (keyboard) =>
        keyboard.onKeyPress?.(
            new LingoKeyboardEvent([...keyPressSet].at(-1) ?? "", keyPressSet)
        ),
    onKeyPress
)
