import EventLoopItem from "../api/core/EventLoopItem"
import nipplejs from "nipplejs"
import { container } from "../engine/renderLoop/renderSetup"
import IJoystick, { joystickDefaults, joystickSchema } from "../interface/IJoystick"
import { Point } from "@lincode/math"
import Nullable from "../interface/utils/Nullable"
import createElement from "../utils/createElement"
import { Cancellable } from "@lincode/promiselikes"

export default class Joystick extends EventLoopItem implements IJoystick {
    public static componentName = "joystick"
    public static defaults = joystickDefaults
    public static schema = joystickSchema

    public onMove: Nullable<(e: Point) => void>
    public onMoveStart: Nullable<(e: Point) => void>
    public onMoveEnd: Nullable<(e: Point) => void>

    public constructor() {
        super()

        this.createEffect(() => {
            const zone = createElement<HTMLDivElement>(`
                <div style="width: 150px; height: 150px; position: absolute; bottom: 25px; left: 25px;"></div>
            `)
            container.appendChild(zone)

            const prevent = (e: Event) => {
                e.preventDefault()
                e.stopPropagation()
            }
            zone.onmousedown = prevent
            zone.ontouchstart = prevent
            zone.onpointerdown = prevent

            const handle = new Cancellable()

            setTimeout(() => {
                const manager = nipplejs.create({
                    zone,
                    mode: "static",
                    position: { left: "75px", bottom: "75px" },
                    color: "white"
                })
                handle.then(() => manager.destroy())

                manager.on("start", () => {
                    this.onMoveStart?.(new Point(0, 0))
                })
                manager.on("move", (_, nipple) => {
                    this.onMove?.(nipple.vector)
                })
                manager.on("end", () => {
                    this.onMoveEnd?.(new Point(0, 0))
                })
            })
            return () => {
                handle.cancel()
            }
        }, [])
    }
}
