import { deg2Rad, endPoint, Point3d, rad2Deg } from "@lincode/math"
import store, { Reactive } from "@lincode/reactivity"
import { interpret } from "xstate"
import { onBeforeRender } from "../../events/onBeforeRender"
import { onRender } from "../../events/onRender"
import { DUMMY_URL, YBOT_URL } from "../../globals"
import IDummy, {
    dummyDefaults,
    dummySchema,
    StrideMode
} from "../../interface/IDummy"
import FoundManager from "../core/FoundManager"
import AnimationManager from "../core/AnimatedObjectManager/AnimationManager"
import Model from "../Model"
import { euler, vector3 } from "../utils/reusables"
import poseMachine from "./poseMachine"
import fpsAlpha from "../utils/fpsAlpha"
import { getCentripetal } from "../../states/useCentripetal"
import { Animation } from "../../interface/IAnimatedObjectManager"

export default class Dummy extends Model implements IDummy {
    public static override componentName = "dummy"
    public static override defaults = dummyDefaults
    public static override schema = dummySchema

    private poseService = interpret(poseMachine)

    public constructor() {
        super()
        this.width = 20
        this.depth = 20
        this.scale = 1.7

        this.createEffect(() => {
            super.animation =
                this.animationState.get() ?? this.poseAnimationState.get()
        }, [this.animationState.get, this.poseAnimationState.get])

        const [setType, getType] = store<
            "mixamo" | "readyplayerme" | "other" | undefined
        >(undefined)
        const [setSpine, getSpine] = store<FoundManager | undefined>(undefined)

        this.createEffect(() => {
            const spineName = this.spineNameState.get()
            super.src = this.srcState.get()

            setSpine(undefined)
            setType(undefined)

            const handle = this.loaded.then((loaded) => {
                setType("other")

                if (spineName) {
                    setSpine(this.find(spineName, true))

                    if (spineName === "mixamorigSpine") setType("mixamo")
                    else if (
                        spineName === "Spine" &&
                        (loaded.getObjectByName("Wolf3D_Body") ||
                            loaded.getObjectByName("Wolf3D_Avatar"))
                    )
                        setType("readyplayerme")
                    return
                }
                if (
                    loaded.getObjectByName("Wolf3D_Body") ||
                    loaded.getObjectByName("Wolf3D_Avatar")
                ) {
                    setSpine(this.find("Spine", true))
                    setType("readyplayerme")
                    return
                }
                const spine = this.find("mixamorigSpine", true)
                setSpine(spine)
                spine && setType("mixamo")
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

            const src = this.srcState.get()
            const parts = src.split("/")
            parts.pop()
            let url = parts.join("/") + "/"

            if (type === "readyplayerme") url = DUMMY_URL + "readyplayerme/"
            else if (src !== YBOT_URL) {
                super.animations = this.animationsState.get()
                this.poseAnimationState.set(getPose())
                return () => {
                    this.poseAnimationState.set(undefined)
                }
            }
            super.animations = {
                idle: url + prefix + "idle.fbx",
                running: url + prefix + "running.fbx",
                runningBackwards: url + prefix + "running-backwards.fbx",
                jumping: url + prefix + "falling.fbx",
                death: url + "death.fbx",
                ...this.animationsState.get()
            }
            this.poseAnimationState.set(getPose())

            return () => {
                this.poseAnimationState.set(undefined)
                super.animations = {}
            }
        }, [
            this.presetState.get,
            this.srcState.get,
            getType,
            this.animationsState.get
        ])

        const { poseService } = this

        this.createEffect(() => {
            const pose = getPose()
            this.poseAnimationState.set(pose)
            if (pose !== "jumping") return

            if (getCentripetal()) {
                vector3.set(this.velocity.x, this.jumpHeight, this.velocity.z)
                vector3.applyMatrix4(this.outerObject3d.matrixWorld)
                Object.assign(this.velocity, vector3.multiplyScalar(0.2))
            } else this.velocity.y = this.jumpHeight

            const handle = onBeforeRender(() => {
                this.velocity.y === 0 && poseService.send("JUMP_STOP")
            })
            return () => {
                handle.cancel()
            }
        }, [getPose])

        poseService
            .onTransition(
                (state) => state.changed && setPose(state.value as string)
            )
            .start()

        this.then(() => poseService.stop())

        this.createEffect(() => {
            const loadedItem = this.loadedGroup.children[0]
            if (!loadedItem) return

            const { strideForward, strideRight, strideMove } = this
            if (!strideForward && !strideRight) {
                poseService.send("RUN_STOP")
                return
            }

            let strideMode = this.strideModeState.get()
            if (
                strideMode === "aim" &&
                !("runningBackwards" in this.animations)
            )
                strideMode = "free"

            const backwards = strideMode === "aim" ? strideForward > 0 : false

            const sf = backwards ? -strideForward : strideForward
            const sr = backwards ? strideRight : -strideRight
            const angle = 90 - Math.atan2(-sf, -sr) * rad2Deg

            const spine = getSpine()
            const spineQuaternion = spine?.outerObject3d.quaternion.clone()
            const loadedItemQuaternion = loadedItem.quaternion.clone()

            const handle = onRender(() => {
                poseService.send(
                    backwards ? "RUN_BACKWARDS_START" : "RUN_START"
                )

                const quaternionOld = loadedItem.quaternion.clone()

                let spinePoint: Point3d | undefined
                if (strideMode === "aim" && spine && spineQuaternion) {
                    loadedItem.quaternion.copy(loadedItemQuaternion)
                    spine.outerObject3d.quaternion.copy(spineQuaternion)
                    spinePoint = spine.pointAt(1000)
                }

                loadedItem.quaternion.setFromEuler(
                    euler.set(0, angle * deg2Rad, 0)
                )
                const quaternionNew = loadedItem.quaternion.clone()
                loadedItem.quaternion
                    .copy(quaternionOld)
                    .slerp(quaternionNew, fpsAlpha(0.2))

                spinePoint && spine?.lookAt(spinePoint)

                if (!strideMove) return

                const { x, y } = endPoint(
                    0,
                    0,
                    angle + 90,
                    Math.max(Math.abs(strideForward), Math.abs(strideRight))
                )
                this.moveForward(backwards ? y : -y)
                this.moveRight(backwards ? x : -x)
            })
            return () => {
                if (
                    strideMode === "aim" &&
                    !this.strideForward &&
                    !this.strideRight
                )
                    loadedItem.quaternion.set(0, 0, 0, 0)

                handle.cancel()
            }
        }, [
            this.animationsState.get,
            this.strideModeState.get,
            this.strideMoveState.get,
            this.strideForwardState.get,
            this.strideRightState.get,
            getSpine
        ])
    }

    private poseAnimationState = new Reactive<Animation | undefined>(undefined)
    private animationState = new Reactive<Animation | undefined>(undefined)
    public override get animation() {
        return this.animationState.get()
    }
    public override set animation(val) {
        this.animationState.set(val)
    }

    private spineNameState = new Reactive<string | undefined>(undefined)
    public get spineName() {
        return this.spineNameState.get()
    }
    public set spineName(val) {
        this.spineNameState.set(val)
    }

    public override get resize() {
        return super.resize
    }
    public override set resize(val) {}

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
    public override set animations(
        val: Record<string, string | AnimationManager>
    ) {
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

    private strideModeState = new Reactive<StrideMode>("aim")
    public get strideMode() {
        return this.strideModeState.get()
    }
    public set strideMode(val) {
        this.strideModeState.set(val)
    }

    private jumpHeight = 10
    public jump(height = 10) {
        this.jumpHeight = height
        this.poseService.send("JUMP_START")
    }
}
