import { endPoint, Point3d, rad2Deg, rotatePoint } from "@lincode/math"
import store, { Reactive } from "@lincode/reactivity"
import { interpret } from "xstate"
import { loop } from "../../engine/eventLoop"
import { onBeforeRender } from "../../events/onBeforeRender"
import IDummy, { dummyDefaults, dummySchema } from "../../interface/IDummy"
import FoundManager from "../core/FoundManager"
import Model from "../Model"
import { point2Vec } from "../utils/vec2Point"
import poseMachine from "./poseMachine"

const url = "https://unpkg.com/lingo3d-dummy@1.0.1/assets/"
const botUrl = url + "ybot.fbx"

export default class Dummy extends Model implements IDummy {
    public static override componentName = "dummy"
    public static override defaults = dummyDefaults
    public static override schema = dummySchema

    private poseService = interpret(poseMachine)

    public constructor () {
        super()
        this.width = 20
        this.depth = 20
        this.scale = 1.7
        this.pbr = true

        this.createEffect(() => {
            if (this.srcState.get() !== botUrl) return

            const preset = this.presetState.get()
            const prefix = preset === "rifle" ? "rifle-" : ""

            this.animations = {
                idle: url + prefix + "idle.fbx",
                running: url + prefix + "running.fbx",
                runningBackwards: url + prefix + "running-backwards.fbx",
                jumping: url + prefix + "falling.fbx"
            }
            this.animation = "idle"
            
            return () => {
                this.animation = undefined
            }
        }, [this.presetState.get, this.srcState.get, this.mixamoState.get])
        
        const { poseService } = this

        const [setPose, getPose] = store("idle")
        this.createEffect(() => {
            const pose = this.animation = getPose()
            if (pose !== "jumping") return

            this.velocity.y = this.jumpHeight

            const handle = loop(() => {
                this.velocity.y === 0 && poseService.send("JUMP_STOP")
            })
            return () => {
                handle.cancel()
            }
        }, [getPose])
        poseService.onTransition(state => state.changed && setPose(state.value as string)).start()
        this.then(() => poseService.stop())

        const [setSpine, getSpine] = store<FoundManager | undefined>(undefined)
        const [setLoaded, getLoaded] = store(false)

        this.createEffect(() => {
            super.src = this.srcState.get()
            setLoaded(false)
            setSpine(undefined)
            const handle = this.loaded.then(() => setLoaded(true))
            return () => {
                handle.cancel()
            }
        }, [this.srcState.get])

        this.createEffect(() => {
            if (!getLoaded() || (this.srcState.get() !== botUrl && !this.mixamoState.get())) return
            setSpine(this.find("mixamorigSpine", true))

        }, [getLoaded, this.mixamoState.get, this.srcState.get])

        this.createEffect(() => {
            const spine = getSpine()
            if (!spine) return

            const spineQuaternion = spine.outerObject3d.quaternion.clone()
            const loadedGroupQuaternion = this.loadedGroup.quaternion.clone()

            const { strideForward, strideRight, strideMove } = this
            if (!strideForward && !strideRight) {
                const thisPoint = this.pointAt(1000)
                this.loadedGroup.lookAt(point2Vec(thisPoint))
                poseService.send("RUN_STOP")
                return
            }

            const backwards = strideForward > 0

            const sf = backwards ? -strideForward : strideForward
            const sr = backwards ? -strideRight : strideRight
            const angle = 90 - Math.atan2(-sf, -sr) * rad2Deg

            const handle = onBeforeRender(() => {
                poseService.send(backwards ? "RUN_BACKWARDS_START" : "RUN_START")

                this.loadedGroup.quaternion.copy(loadedGroupQuaternion)
                spine.outerObject3d.quaternion.copy(spineQuaternion)
                const spinePoint = spine.pointAt(1000)
                
                const thisPoint = this.pointAt(1000)
                const centerPoint = this.getWorldPosition()
                const rotated = rotatePoint({ x: thisPoint.x, y: thisPoint.z }, { x: centerPoint.x, y: centerPoint.z }, angle)
                const groupPoint = new Point3d(rotated.x, thisPoint.y, rotated.y)
                this.loadedGroup.lookAt(point2Vec(groupPoint))

                spine.lookAt(spinePoint)

                if (!strideMove) return

                const { x, y } = endPoint(0, 0, angle + 90, Math.max(Math.abs(strideForward), Math.abs(strideRight)))
                this.moveForward(backwards ? y : -y)
                this.moveRight(backwards ? -x : x)
            })
            return () => {
                handle.cancel()
                spine.outerObject3d.quaternion.copy(spineQuaternion)
                this.loadedGroup.quaternion.copy(loadedGroupQuaternion)
            }
        }, [this.strideMoveState.get, this.strideForwardState.get, this.strideRightState.get, getSpine])
    }

    private mixamoState = new Reactive(false)
    public get mixamo() {
        return this.mixamoState.get()
    }
    public set mixamo(val) {
        this.mixamoState.set(val)
    }

    private srcState = new Reactive(botUrl)
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
    
    private strideMoveState = new Reactive(false)
    public get strideMove() {
        return this.strideMoveState.get()
    }
    public set strideMove(val) {
        this.strideMoveState.set(val)
    }

    private jumpHeight = 10
    public jump(height = 10) {
        this.jumpHeight = height
        this.poseService.send("JUMP_START")
    }
}