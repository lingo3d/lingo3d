import { event } from "@lincode/events"
import { Group } from "three"
import IKeyboard, { keyboardDefaults, keyboardSchema } from "../interface/IKeyboard"
import { loop } from "../engine/eventLoop"
import EventLoopItem from "./core/EventLoopItem"
import { createEffect } from "@lincode/reactivity"
import { getCamera } from "../states/useCamera"
import mainCamera from "../engine/mainCamera"
import { getSelection } from "../states/useSelection"
import { getSelectionBlockKeyboard } from "../states/useSelectionBlockKeyboard"

const [emitDown, onDown] = event<string>()
const [emitUp, onUp] = event<string>()
const [emitPress, onPress] = event()

export const isPressed = new Set<string>()

const processKey = (str: string) => {
    str = str.length === 1 ? str.toLowerCase() : str
    if (str === " ") str = "Space"
    return str
}

createEffect(() => {
    if (getSelection() && getCamera() === mainCamera && getSelectionBlockKeyboard()) return

    const handle = loop(() => isPressed.size > 0 && emitPress())

    const handleKeyDown = (e: KeyboardEvent): void => {
        const key = processKey(e.key)
        isPressed.add(key)
        emitDown(key)
        if (isPressed.has("Meta") && isPressed.has("Shift"))
            clear()
    }
    
    const handleKeyUp = (e: KeyboardEvent): void => {
        const key = processKey(e.key)
        isPressed.delete(key)
        emitUp(key)
    }
    
    const clear = () => {
        if (!isPressed.size) return
        const pressed = [...isPressed]
        isPressed.clear()
        for (const key of pressed)
            emitUp(key)
    }
    
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
    window.addEventListener("blur", clear)
    window.addEventListener("focus", clear)
    document.addEventListener("visibilitychange", clear)

    return () => {
        handle.cancel()
        document.removeEventListener("keydown", handleKeyDown)
        document.removeEventListener("keyup", handleKeyUp)
        window.removeEventListener("blur", clear)
        window.removeEventListener("focus", clear)
        document.removeEventListener("visibilitychange", clear)
    }
}, [getSelection, getCamera, getSelectionBlockKeyboard])

export class Keyboard extends EventLoopItem implements IKeyboard {
    public static componentName = "keyboard"
    public static defaults = keyboardDefaults
    public static schema = keyboardSchema

    public outerObject3d = new Group()

    public onKeyPress?: (key: string, keys: Set<string>) => void
    public onKeyUp?: (key: string, keys: Set<string>) => void
    public onKeyDown?: (key: string, keys: Set<string>) => void

    public constructor() {
        super()
        this.initOuterObject3d()

        this.watch(onPress(() => {
            if (!this.onKeyPress) return
            for (const key of isPressed)
                this.onKeyPress(key, isPressed)
        }))
        this.watch(onUp(key => this.onKeyUp?.(key, isPressed)))
        this.watch(onDown(key => this.onKeyDown?.(key, isPressed)))
    }
}

export default new Keyboard()