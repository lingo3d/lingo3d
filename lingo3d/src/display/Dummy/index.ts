import store, { Reactive } from "@lincode/reactivity"
import { interpret } from "xstate"
import IDummy, { dummyDefaults, dummySchema } from "../../interface/IDummy"
import Model from "../Model"
import poseMachine from "./poseMachine"

const url = "https://unpkg.com/lingo3d-dummy@1.0.0/assets/"

export default class Dummy extends Model implements IDummy {
    public static override componentName = "dummy"
    public static override defaults = dummyDefaults
    public static override schema = dummySchema

    private poseService = interpret(poseMachine)

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
        
        const [setPose, getPose] = store("idle")
        this.createEffect(() => {
            const pose = getPose()
            this.animation = pose
        }, [getPose])
        this.poseService.onTransition(state => setPose(state.value as string)).start()
        this.then(() => this.poseService.stop())

        this.createEffect(() => {
            const { strideForward, strideRight } = this

            console.log(strideForward, strideRight)

        }, [this.strideForwardState.get, this.strideRightState.get])
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