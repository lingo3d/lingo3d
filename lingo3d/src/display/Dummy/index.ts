import { endPoint, Point3d, rad2Deg, rotatePoint } from "@lincode/math"
import store, { Reactive } from "@lincode/reactivity"
import { Vector3 } from "three"
import { interpret } from "xstate"
import { onBeforeRender } from "../../events/onBeforeRender"
import { onRender } from "../../events/onRender"
import { DUMMY_URL, YBOT_URL } from "../../globals"
import IDummy, { dummyDefaults, dummySchema, StrideMode } from "../../interface/IDummy"
import FoundManager from "../core/FoundManager"
import AnimationManager from "../core/mixins/AnimationMixin/AnimationManager"
import Model from "../Model"
import { point2Vec } from "../utils/vec2Point"
import poseMachine from "./poseMachine"

export const dummyTypeMap = new WeakMap<Dummy, "dummy" | "readyplayerme">()

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
        this.frustumCulled = false

        const [setType, getType] = store<"mixamo" | "readyplayerme" | undefined>(undefined)
        const [setSpine, getSpine] = store<FoundManager | undefined>(undefined)

        this.createEffect(() => {
            const spineName = this.spineNameState.get()
            const src = super.src = this.srcState.get()
            
            setSpine(undefined)
            setType(undefined)
            dummyTypeMap.delete(this)

            const handle = this.loaded.then(loaded => {
                if (spineName) {
                    setSpine(this.find(spineName, true))

                    if (spineName === "mixamorigSpine") {
                        setType("mixamo")
                        src === YBOT_URL && dummyTypeMap.set(this, "dummy")
                    }
                    else if (spineName === "Spine" && loaded.getObjectByName("Wolf3D_Body")) {
                        setType("readyplayerme")
                        dummyTypeMap.set(this, "readyplayerme")
                    }
                    return
                }
                if (loaded.getObjectByName("Wolf3D_Body")) {
                    setSpine(this.find("Spine", true))
                    setType("readyplayerme")
                    dummyTypeMap.set(this, "readyplayerme")
                    return
                }
                const spine = this.find("mixamorigSpine", true)
                setSpine(spine)
                if (spine) {
                    setType("mixamo")
                    src === YBOT_URL && dummyTypeMap.set(this, "dummy")
                }
            })
            return () => {
                handle.cancel()
            }
        }, [this.srcState.get, this.spineNameState.get])

        const [setPose, getPose] = store("idle")

        this.createEffect(() => {
            const type = getType()
            if (!type) return

            const preset = this.presetState.get()
            const prefix = preset === "rifle" ? "rifle-" : ""

            const parts = this.srcState.get().split("/")
            parts.pop()
            let url = parts.join("/") + "/"

            let done = false
            ;(async () => {
                const res = await fetch(url + prefix + "idle.fbx", { method: "HEAD" })
                if (done) return

                if (!res.ok) {
                    if (type === "readyplayerme")
                        url = DUMMY_URL + "readyplayerme/"
                    else
                        return
                }

                super.animations = {
                    idle: url + prefix + "idle.fbx",
                    running: url + prefix + "running.fbx",
                    runningBackwards: url + prefix + "running-backwards.fbx",
                    jumping: url + prefix + "falling.fbx",
                    death: url + "death.fbx",
                    ...this.animationsState.get()
                }
                this.animation = getPose()
            })()
            
            return () => {
                done = true
                this.animation = undefined
                super.animations = {}
            }
        }, [this.presetState.get, this.srcState.get, getType, this.animationsState.get])
        
        const { poseService } = this
        this.createEffect(() => {
            const pose = this.animation = getPose()
            if (pose !== "jumping") return

            this.velocity.y = this.jumpHeight

            const handle = onBeforeRender(() => {
                this.velocity.y === 0 && poseService.send("JUMP_STOP")
            })
            return () => {
                handle.cancel()
            }
        }, [getPose])
        poseService.onTransition(state => state.changed && setPose(state.value as string)).start()
        this.then(() => poseService.stop())

        let groupVecOld: Vector3 | undefined

        const computeAngle = (angle: number) => {
            const thisPoint = this.pointAt(1000)
            const centerPoint = this.getWorldPosition()
            const rotated = rotatePoint({ x: thisPoint.x, y: thisPoint.z }, { x: centerPoint.x, y: centerPoint.z }, angle)
            return point2Vec(new Point3d(rotated.x, thisPoint.y, rotated.y))
        }

        this.createEffect(() => {
            const spine = getSpine()
            if (!spine) return

            const spineQuaternion = spine.outerObject3d.quaternion.clone()
            const loadedGroupQuaternion = this.loadedGroup.quaternion.clone()

            const { strideForward, strideRight, strideMove } = this
            if (!strideForward && !strideRight) {
                poseService.send("RUN_STOP")
                this.strideMode === "aim" && (groupVecOld = undefined)
                return
            }

            const backwards = this.strideMode === "aim" ? strideForward > 0 : false

            const sf = backwards ? -strideForward : strideForward
            const sr = backwards ? -strideRight : strideRight
            const angle = 90 - (Math.atan2(-sf, -sr) * rad2Deg)

            const handle = onRender(() => {
                poseService.send(backwards ? "RUN_BACKWARDS_START" : "RUN_START")

                let spinePoint: Point3d | undefined
                if (this.strideMode === "aim") {
                    this.loadedGroup.quaternion.copy(loadedGroupQuaternion)
                    spine.outerObject3d.quaternion.copy(spineQuaternion)
                    spinePoint = spine.pointAt(1000)
                }
                
                const groupVecNew = computeAngle(angle)
                const groupVec = (groupVecOld ?? computeAngle(0)).lerp(groupVecNew, 0.1)
                this.loadedGroup.lookAt(groupVec)
                groupVecOld = groupVec

                spinePoint && spine.lookAt(spinePoint)

                if (!strideMove) return

                const { x, y } = endPoint(0, 0, angle + 90, Math.max(Math.abs(strideForward), Math.abs(strideRight)))
                this.moveForward(backwards ? y : -y)
                this.moveRight(backwards ? -x : x)
            })
            return () => {
                handle.cancel()
                if (this.strideMode === "aim") {
                    spine.outerObject3d.quaternion.copy(spineQuaternion)
                    this.loadedGroup.quaternion.copy(loadedGroupQuaternion)
                }
            }
        }, [this.strideMoveState.get, this.strideForwardState.get, this.strideRightState.get, getSpine])
    }
    
    private spineNameState = new Reactive<string | undefined>(undefined)
    public get spineName() {
        return this.spineNameState.get()
    }
    public set spineName(val) {
        this.spineNameState.set(val)
    }

    private srcState = new Reactive(YBOT_URL)
    public override get src() {
        return this.srcState.get()
    }
    public override set src(val) {
        this.srcState.set(val)
    }

    private animationsState = new Reactive({})
    public override get animations(): Record<string, AnimationManager> {
        return super.animations
    }
    public override set animations(val: Record<string, string | AnimationManager>) {
        this.animationsState.set(val)
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

    public strideMode: StrideMode = "aim"

    private jumpHeight = 10
    public jump(height = 10) {
        this.jumpHeight = height
        this.poseService.send("JUMP_START")
    }
}