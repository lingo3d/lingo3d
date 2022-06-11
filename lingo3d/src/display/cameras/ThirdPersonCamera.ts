import CharacterCamera from "../core/CharacterCamera"
import { onBeforeCameraLoop } from "../core/mixins/PhysicsMixin/bvh/bvhCameraLoop"
import { quaternion, vector3 } from "../utils/reusables"

export default class ThirdPersonCamera extends CharacterCamera {
    public static override componentName = "thirdPersonCamera"

    public constructor() {
        super()
        this.innerZ = 200
        this.mouseControlMode = "orbit"

        const cam = this.camera

        this.createEffect(() => {
            const target = this.targetState.get()
            if (target) return
            
            const handle = onBeforeCameraLoop(() => {
                cam.position.copy(this.object3d.getWorldPosition(vector3))
                cam.quaternion.copy(this.object3d.getWorldQuaternion(quaternion))
            })
            return () => {
                handle.cancel()
            }
        }, [this.targetState.get])

        import("../core/mixins/PhysicsMixin/enableBVHCamera").then(module => module.default.call(this))
    }
}