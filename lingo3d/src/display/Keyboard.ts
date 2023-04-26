import IKeyboard, {
    keyboardDefaults,
    keyboardSchema,
    LingoKeyboardEvent
} from "../interface/IKeyboard"
import Appendable from "../api/core/Appendable"
import { onKeyDown } from "../events/onKeyDown"
import { onKeyPress } from "../events/onKeyPress"
import { onKeyUp } from "../events/onKeyUp"
import { keyPressSet } from "../collections/keyPressSet"

export default class Keyboard extends Appendable implements IKeyboard {
    public static componentName = "keyboard"
    public static defaults = keyboardDefaults
    public static schema = keyboardSchema

    private _onKeyPress?: (e: LingoKeyboardEvent) => void
    public get onKeyPress() {
        return this._onKeyPress
    }
    public set onKeyPress(val) {
        this._onKeyPress = val
        this.cancelHandle(
            "onKeyPress",
            val &&
                (() =>
                    onKeyPress(() =>
                        val(
                            new LingoKeyboardEvent(
                                [...keyPressSet].at(-1) ?? "",
                                keyPressSet
                            )
                        )
                    ))
        )
    }

    private _onKeyUp?: (e: LingoKeyboardEvent) => void
    public get onKeyUp() {
        return this._onKeyUp
    }
    public set onKeyUp(val) {
        this._onKeyUp = val
        this.cancelHandle(
            "onKeyUp",
            val &&
                (() =>
                    onKeyUp((key) =>
                        val(new LingoKeyboardEvent(key, keyPressSet))
                    ))
        )
    }

    private _onKeyDown?: (e: LingoKeyboardEvent) => void
    public get onKeyDown() {
        return this._onKeyDown
    }
    public set onKeyDown(val) {
        this._onKeyDown = val
        this.cancelHandle(
            "onKeyDown",
            val &&
                (() =>
                    onKeyDown((key) =>
                        val(new LingoKeyboardEvent(key, keyPressSet))
                    ))
        )
    }
}
