import IMouse, {
    mouseDefaults,
    mouseSchema,
    SimpleMouseEvent
} from "../interface/IMouse"
import store from "@lincode/reactivity"
import Nullable from "../interface/utils/Nullable"
import { onBeforeRender } from "../events/onBeforeRender"
import Appendable from "./core/Appendable"
import { onMouseDown } from "../events/onMouseDown"
import { onMouseUp } from "../events/onMouseUp"
import { onMouseRightClick } from "../events/onMouseRightClick"
import { onMouseClick } from "../events/onMouseClick"
import { onMouseMove } from "../events/onMouseMove"
import { getWorldPlay } from "../states/useWorldPlay"
import { worldPlayPtr } from "../pointers/worldPlayPtr"

export default class Mouse extends Appendable implements IMouse {
    public static componentName = "mouse"
    public static defaults = mouseDefaults
    public static schema = mouseSchema

    public onClick: Nullable<(e: SimpleMouseEvent) => void>
    public onRightClick: Nullable<(e: SimpleMouseEvent) => void>
    public onMouseMove: Nullable<(e: SimpleMouseEvent) => void>
    public onMouseDown: Nullable<(e: SimpleMouseEvent) => void>
    public onMouseUp: Nullable<(e: SimpleMouseEvent) => void>
    public onMousePress: Nullable<(e: SimpleMouseEvent) => void>

    public constructor() {
        super()

        let currentPayload = new SimpleMouseEvent(0, 0, 0, 0)
        const [setDown, getDown] = store(false)

        this.createEffect(() => {
            const { onMousePress } = this
            if (!getDown() || !onMousePress) return

            const handle = onBeforeRender(() => onMousePress(currentPayload))

            return () => {
                handle.cancel()
            }
        }, [getDown])

        this.createEffect(() => {
            if (worldPlayPtr[0] !== "live") return

            const handle0 = onMouseMove((e) => {
                this.onMouseMove?.(e)
                currentPayload = e
            })
            const handle1 = onMouseClick((e) => {
                this.onClick?.(e)
                currentPayload = e
            })
            const handle2 = onMouseRightClick((e) => {
                this.onRightClick?.(e)
                currentPayload = e
            })
            const handle3 = onMouseDown((e) => {
                this.onMouseDown?.(e)
                currentPayload = e
                setDown(true)
            })
            const handle4 = onMouseUp((e) => {
                this.onMouseUp?.(e)
                currentPayload = e
                setDown(false)
            })

            return () => {
                handle0.cancel()
                handle1.cancel()
                handle2.cancel()
                handle3.cancel()
                handle4.cancel()
            }
        }, [getWorldPlay])
    }
}
