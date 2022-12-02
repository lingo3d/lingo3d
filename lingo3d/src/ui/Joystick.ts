import nipplejs from "nipplejs"
import IJoystick, {
    joystickDefaults,
    joystickSchema
} from "../interface/IJoystick"
import { Point } from "@lincode/math"
import Nullable from "../interface/utils/Nullable"
import createElement from "../utils/createElement"
import { Cancellable } from "@lincode/promiselikes"
import store, { Reactive } from "@lincode/reactivity"
import { onBeforeRender } from "../events/onBeforeRender"
import Appendable from "../api/core/Appendable"
import { uiContainer } from "../engine/renderLoop/renderSetup"

export default class Joystick extends Appendable implements IJoystick {
    public static componentName = "joystick"
    public static defaults = joystickDefaults
    public static schema = joystickSchema

    public onMove: Nullable<(e: Point) => void>
    public onMoveStart: Nullable<(e: Point) => void>
    public onMoveEnd: Nullable<(e: Point) => void>

    private onPressState = new Reactive<((e: Point) => void) | undefined>(
        undefined
    )
    public get onPress() {
        return this.onPressState.get()
    }
    public set onPress(cb) {
        this.onPressState.set(cb)
    }

    public constructor() {
        super()

        let pt = new Point(0, 0)
        const [setDown, getDown] = store(false)

        this.createEffect(() => {
            const cb = this.onPressState.get()
            if (!cb || !getDown()) return

            const handle = onBeforeRender(() => {
                cb(pt)
            })
            return () => {
                return handle.cancel()
            }
        }, [this.onPressState.get, getDown])

        this.createEffect(() => {
            const zone = createElement<HTMLDivElement>(`
                <div style="width: 150px; height: 150px; position: absolute; bottom: 25px; left: 25px;"></div>
            `)
            uiContainer.appendChild(zone)

            const prevent = (e: Event) => {
                e.preventDefault()
                e.stopPropagation()
            }
            zone.onmousedown = prevent
            zone.ontouchstart = prevent
            zone.onpointerdown = prevent

            const handle = new Cancellable()
            setTimeout(() => {
                if (handle.done) return

                const manager = nipplejs.create({
                    zone,
                    mode: "static",
                    position: { left: "75px", bottom: "75px" },
                    color: "white"
                })
                handle.then(() => manager.destroy())

                manager.on("start", () => {
                    this.onMoveStart?.(new Point(0, 0))
                    setDown(true)
                })
                manager.on("move", (_, nipple) => {
                    this.onMove?.(nipple.vector)
                    pt = nipple.vector
                })
                manager.on("end", () => {
                    this.onMoveEnd?.(new Point(0, 0))
                    pt = new Point(0, 0)
                    setDown(false)
                })
            })
            return () => {
                handle.cancel()
                zone.remove()
            }
        }, [])
    }
}
