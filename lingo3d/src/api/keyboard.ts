import { event } from "@lincode/events"
import { Group } from "three"
import IKeyboard, { keyboardDefaults, keyboardSchema } from "../interface/IKeyboard"
import { loop } from "../engine/eventLoop"
import EventLoopItem from "./core/EventLoopItem"
import { createEffect } from "@lincode/reactivity"
import { getSelectionBlockKeyboard } from "../states/useSelectionBlockKeyboard"
import { appendableRoot } from "./core/Appendable"
import { getEditorActive } from "../states/useEditorActive"
import { onKeyClear } from "../events/onKeyClear"

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
    if (getEditorActive() && getSelectionBlockKeyboard()) return

    const handle = loop(() => isPressed.size > 0 && emitPress())

    const handleKeyDown = (e: KeyboardEvent): void => {
        const key = processKey(e.key)
        isPressed.add(key)
        emitDown(key)
    }
    
    const handleKeyUp = (e: KeyboardEvent): void => {
        const key = processKey(e.key)
        isPressed.delete(key)
        emitUp(key)
        !isPressed.size && emitPress()
    }

    handle.watch(onKeyClear(() => {
        if (!isPressed.size) return
        const pressed = [...isPressed]
        isPressed.clear()
        for (const key of pressed)
            emitUp(key)
    }))
    
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)

    return () => {
        handle.cancel()
        document.removeEventListener("keydown", handleKeyDown)
        document.removeEventListener("keyup", handleKeyUp)
    }
}, [getEditorActive, getSelectionBlockKeyboard])

export class Keyboard extends EventLoopItem implements IKeyboard {
    public static componentName = "keyboard"
    public static defaults = keyboardDefaults
    public static schema = keyboardSchema

    public onKeyPress?: (key: string, keys: Set<string>) => void
    public onKeyUp?: (key: string, keys: Set<string>) => void
    public onKeyDown?: (key: string, keys: Set<string>) => void

    public constructor() {
        super(new Group())

        this.watch(onPress(() => {
            if (!this.onKeyPress) return

            if (!isPressed.size) {
                this.onKeyPress("", isPressed)
                return
            }
            for (const key of isPressed)
                this.onKeyPress(key, isPressed)
        }))
        this.watch(onUp(key => this.onKeyUp?.(key, isPressed)))
        this.watch(onDown(key => this.onKeyDown?.(key, isPressed)))
    }
}

const keyboard = new Keyboard()
appendableRoot.delete(keyboard)

export default keyboard