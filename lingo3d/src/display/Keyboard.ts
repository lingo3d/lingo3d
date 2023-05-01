import IKeyboard, {
    keyboardDefaults,
    keyboardSchema,
    LingoKeyboardEvent
} from "../interface/IKeyboard"
import Appendable from "../api/core/Appendable"
import {
    addKeyDownSystem,
    deleteKeyDownSystem
} from "../systems/eventSystems/keyDownSystem"
import {
    addKeyUpSystem,
    deleteKeyUpSystem
} from "../systems/eventSystems/keyUpSystem"
import {
    addKeyPressSystem,
    deleteKeyPressSystem
} from "../systems/eventSystems/keyPressSystem"

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
        val ? addKeyPressSystem(this) : deleteKeyPressSystem(this)
    }

    private _onKeyUp?: (e: LingoKeyboardEvent) => void
    public get onKeyUp() {
        return this._onKeyUp
    }
    public set onKeyUp(val) {
        this._onKeyUp = val
        val ? addKeyUpSystem(this) : deleteKeyUpSystem(this)
    }

    private _onKeyDown?: (e: LingoKeyboardEvent) => void
    public get onKeyDown() {
        return this._onKeyDown
    }
    public set onKeyDown(val) {
        this._onKeyDown = val
        val ? addKeyDownSystem(this) : deleteKeyDownSystem(this)
    }
}
