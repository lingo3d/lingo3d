import { event } from "@lincode/events"
import { Group } from "three"
import IKeyboard from "../interface/IKeyboard"
import { loop } from "../engine/eventLoop"
import EventLoopItem from "./core/EventLoopItem"

const [emitDown, onDown] = event<string>()
const [emitUp, onUp] = event<string>()
const [emitPress, onPress] = event()

export const isPressed = new Set<string>()
loop(() => isPressed.size > 0 && emitPress())

const processKey = (str: string) => {
    str = str.length === 1 ? str.toLowerCase() : str
    if (str === " ") str = "Space"
    return str
}

document.addEventListener("keydown", e => {
    const key = processKey(e.key)
    isPressed.add(key)
    emitDown(key)
    if (isPressed.has("Meta") && isPressed.has("Shift"))
        clear()
})

document.addEventListener("keyup", e => {
    const key = processKey(e.key)
    isPressed.delete(key)
    emitUp(key)
})

const clear = () => {
    if (!isPressed.size) return
    const pressed = [...isPressed]
    isPressed.clear()
    for (const key of pressed)
        emitUp(key)
}
window.addEventListener("blur", clear)
window.addEventListener("focus", clear)
document.addEventListener("visibilitychange", clear)

export class Keyboard extends EventLoopItem implements IKeyboard {
    public outerObject3d = new Group()

    public onKeyPress?: (key: string) => void
    public onKeyUp?: (key: string) => void
    public onKeyDown?: (key: string) => void

    public constructor() {
        super()
        this.initOuterObject3d()

        this.watch(onPress(() => {
            if (!this.onKeyPress) return
            for (const key of isPressed)
                this.onKeyPress(key)
        }))
        this.watch(onUp(key => this.onKeyUp?.(key)))
        this.watch(onDown(key => this.onKeyDown?.(key)))
    }
}

export default new Keyboard()