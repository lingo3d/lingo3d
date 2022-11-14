import { event } from "@lincode/events"
import IKeyboard, {
    keyboardDefaults,
    keyboardSchema
} from "../interface/IKeyboard"
import { createEffect } from "@lincode/reactivity"
import { onKeyClear } from "../events/onKeyClear"
import Nullable from "../interface/utils/Nullable"
import { onBeforeRender } from "../events/onBeforeRender"
import { getEditorMounted } from "../states/useEditorMounted"
import { getCameraRendered } from "../states/useCameraRendered"
import mainCamera from "../engine/mainCamera"
import { appendableRoot } from "./core/collections"
import { getEditorPlay } from "../states/useEditorPlay"
import Appendable from "./core/Appendable"

const [emitDown, onDown] = event<string>()
const [emitUp, onUp] = event<string>()
const [emitPress, onPress] = event()

export const isPressed = new Set<string>()

const processKey = (str: string) => {
    str = str.length === 1 ? str.toLocaleLowerCase() : str
    if (str === " ") str = "Space"
    return str
}

createEffect(() => {
    if (
        !getEditorPlay() ||
        (getEditorMounted() && getCameraRendered() === mainCamera)
    )
        return

    const handle = onBeforeRender(() => isPressed.size > 0 && emitPress())

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

    handle.watch(
        onKeyClear(() => {
            if (!isPressed.size) return
            const pressed = [...isPressed]
            isPressed.clear()
            for (const key of pressed) emitUp(key)
        })
    )

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)

    return () => {
        handle.cancel()
        document.removeEventListener("keydown", handleKeyDown)
        document.removeEventListener("keyup", handleKeyUp)
    }
}, [getEditorPlay, getEditorMounted, getCameraRendered])

export class Keyboard extends Appendable implements IKeyboard {
    public static componentName = "keyboard"
    public static defaults = keyboardDefaults
    public static schema = keyboardSchema

    public onKeyPress: Nullable<(key: string, keys: Set<string>) => void>
    public onKeyUp: Nullable<(key: string, keys: Set<string>) => void>
    public onKeyDown: Nullable<(key: string, keys: Set<string>) => void>

    public constructor() {
        super()

        this.watch(
            onPress(() => {
                if (!this.onKeyPress) return

                if (!isPressed.size) {
                    this.onKeyPress("", isPressed)
                    return
                }
                for (const key of isPressed) this.onKeyPress(key, isPressed)
            })
        )
        this.watch(onUp((key) => this.onKeyUp?.(key, isPressed)))
        this.watch(onDown((key) => this.onKeyDown?.(key, isPressed)))
    }
}

const keyboard = new Keyboard()
appendableRoot.delete(keyboard)

export default keyboard
