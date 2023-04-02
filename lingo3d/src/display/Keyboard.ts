import IKeyboard, {
    keyboardDefaults,
    keyboardSchema,
    LingoKeyboardEvent
} from "../interface/IKeyboard"
import Nullable from "../interface/utils/Nullable"
import Appendable from "../api/core/Appendable"
import { onKeyDown } from "../events/onKeyDown"
import { onKeyPress } from "../events/onKeyPress"
import { onKeyUp } from "../events/onKeyUp"
import { keyPressSet } from "../collections/keyPressSet"

export default class Keyboard extends Appendable implements IKeyboard {
    public static componentName = "keyboard"
    public static defaults = keyboardDefaults
    public static schema = keyboardSchema

    public onKeyPress: Nullable<(e: LingoKeyboardEvent) => void>
    public onKeyUp: Nullable<(e: LingoKeyboardEvent) => void>
    public onKeyDown: Nullable<(e: LingoKeyboardEvent) => void>

    public constructor() {
        super()

        this.watch(
            onKeyPress(() =>
                this.onKeyPress?.(
                    new LingoKeyboardEvent(
                        [...keyPressSet].at(-1) ?? "",
                        keyPressSet
                    )
                )
            )
        )
        this.watch(
            onKeyUp((key) =>
                this.onKeyUp?.(new LingoKeyboardEvent(key, keyPressSet))
            )
        )
        this.watch(
            onKeyDown((key) =>
                this.onKeyDown?.(new LingoKeyboardEvent(key, keyPressSet))
            )
        )
    }
}
