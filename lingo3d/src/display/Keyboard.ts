import IKeyboard, {
    keyboardDefaults,
    keyboardSchema,
    LingoKeyboardEvent
} from "../interface/IKeyboard"
import { keyDownSystem } from "../systems/eventSystems/keyDownSystem"
import { keyPressSystem } from "../systems/eventSystems/keyPressSystem"
import { keyUpSystem } from "../systems/eventSystems/keyUpSystem"
import Appendable from "./core/Appendable"

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
        val ? keyPressSystem.add(this) : keyPressSystem.delete(this)
    }

    private _onKeyUp?: (e: LingoKeyboardEvent) => void
    public get onKeyUp() {
        return this._onKeyUp
    }
    public set onKeyUp(val) {
        this._onKeyUp = val
        val ? keyUpSystem.add(this) : keyUpSystem.delete(this)
    }

    private _onKeyDown?: (e: LingoKeyboardEvent) => void
    public get onKeyDown() {
        return this._onKeyDown
    }
    public set onKeyDown(val) {
        this._onKeyDown = val
        val ? keyDownSystem.add(this) : keyDownSystem.delete(this)
    }
}
