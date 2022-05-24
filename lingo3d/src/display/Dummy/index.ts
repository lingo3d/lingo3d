import { rad2Deg, rotatePoint } from "@lincode/math"
import store, { Reactive } from "@lincode/reactivity"
import { interpret } from "xstate"
import Point3d from "../../api/Point3d"
import { onBeforeRender } from "../../events/onBeforeRender"
import IDummy, { dummyDefaults, dummySchema } from "../../interface/IDummy"
import FoundManager from "../core/FoundManager"
import Model from "../Model"
import { vector3, vector3_ } from "../utils/reusables"
import { point2Vec } from "../utils/vec2Point"
import poseMachine from "./poseMachine"

const url = "https://unpkg.com/lingo3d-dummy@1.0.0/assets/"

export default class Dummy extends Model implements IDummy {
    public static override componentName = "dummy"
    public static override defaults = dummyDefaults
    public static override schema = dummySchema

    public constructor () {
        super()
        this.width = 20
        this.depth = 20
        this.pbr = true

        this.createEffect(() => {
            super.src = this.srcState.get()

            const preset = this.presetState.get()
            const prefix = preset === "rifle" ? "rifle-" : ""

            this.animations = {
                idle: url + prefix + "idle.fbx",
                running: url + prefix + "running.fbx",
                falling: url + prefix + "falling.fbx"
            }
            this.animation = "idle"

        }, [this.presetState.get, this.srcState.get])
        
        const poseService = interpret(poseMachine)

        const [setPose, getPose] = store("idle")
        this.createEffect(() => {
            this.animation = getPose()
        }, [getPose])
        poseService.onTransition(state => setPose(state.value as string)).start()
        this.then(() => poseService.stop())

        const [setSpine, getSpine] = store<FoundManager | undefined>(undefined)
        this.loadedResolvable.then(() => setSpine(this.find("mixamorigSpine")))

        this.createEffect(() => {
            const spine = getSpine()
            if (!spine) return

            const { strideForward, strideRight } = this
            if (!strideForward && !strideRight) {
                const thisPoint = this.pointAt(1000)
                this.loadedGroup.lookAt(point2Vec(thisPoint))
                poseService.send("RUN_STOP")
                return
            }

            const handle = onBeforeRender(() => {
                const thisPoint = this.pointAt(1000)
                this.loadedGroup.lookAt(point2Vec(thisPoint))

                const spinePoint = spine.pointAt(1000)
                
                const angle = 90 - Math.atan2(-strideForward, -strideRight) * rad2Deg
                const centerPoint = this.getWorldPosition()
                const rotated = rotatePoint({ x: thisPoint.x, y: thisPoint.z }, { x: centerPoint.x, y: centerPoint.z }, angle)
                const groupPoint = new Point3d(rotated.x, thisPoint.y, rotated.y)
                this.loadedGroup.lookAt(point2Vec(groupPoint))

                spine.lookAt(spinePoint)
            })

            poseService.send("RUN_START")
            return () => {
                handle.cancel()
            }
        }, [this.strideForwardState.get, this.strideRightState.get, getSpine])
    }

    private srcState = new Reactive(url + "ybot.fbx")
    public override get src() {
        return this.srcState.get()
    }
    public override set src(val) {
        this.srcState.set(val)
    }

    private presetState = new Reactive<"default" | "rifle">("default")
    public get preset() {
        return this.presetState.get()
    }
    public set preset(val) {
        this.presetState.set(val)
    }

    private strideForwardState = new Reactive(0)
    public get strideForward() {
        return this.strideForwardState.get()
    }
    public set strideForward(val) {
        this.strideForwardState.set(val)
    }

    private strideRightState = new Reactive(0)
    public get strideRight() {
        return this.strideRightState.get()
    }
    public set strideRight(val) {
        this.strideRightState.set(val)
    }
}