import nipplejs from "nipplejs"
import IJoystick, {
    joystickDefaults,
    joystickSchema
} from "../interface/IJoystick"
import Nullable from "../interface/utils/Nullable"
import createElement from "../utils/createElement"
import store, { Reactive } from "@lincode/reactivity"
import { onBeforeRender } from "../events/onBeforeRender"
import Appendable from "../display/core/Appendable"
import { onResize } from "../events/onResize"
import { uiContainer } from "../engine/renderLoop/containers"
import { PointType } from "../typeGuards/isPoint"
import Point from "../math/Point"

export default class Joystick extends Appendable implements IJoystick {
    public static componentName = "joystick"
    public static defaults = joystickDefaults
    public static schema = joystickSchema
    public static includeKeys = ["onMove"]

    public onMove: Nullable<(e: PointType) => void>
    public onMoveStart: Nullable<(e: PointType) => void>
    public onMoveEnd: Nullable<(e: PointType) => void>

    private onPressState = new Reactive<((e: PointType) => void) | undefined>(
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

            const handle = onBeforeRender(() => cb(pt))
            return () => {
                return handle.cancel()
            }
        }, [this.onPressState.get, getDown])

        const [setRefresh, getRefresh] = store({})
        this.watch(onResize(() => setRefresh({})))

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

            const manager = nipplejs.create({
                zone,
                mode: "static",
                position: { left: "75px", bottom: "75px" },
                color: "white"
            })

            manager.on("start", () => {
                this.onMoveStart?.(new Point(0, 0))
                setDown(true)
            })
            manager.on("move", (_, nipple) => {
                this.onMove?.(nipple.vector)
                pt = nipple.vector
            })
            manager.on("end", () => {
                pt = new Point(0, 0)
                this.onMove?.(pt)
                this.onMoveEnd?.(pt)
                setDown(false)
            })
            return () => {
                manager.destroy()
                zone.remove()
            }
        }, [getRefresh])
    }
}
