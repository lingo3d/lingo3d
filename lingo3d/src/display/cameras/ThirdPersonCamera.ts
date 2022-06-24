import CharacterCamera from "../core/CharacterCamera"
import { onBeforeCameraLoop } from "../core/mixins/PhysicsMixin/bvh/bvhCameraLoop"
import getWorldPosition from "../utils/getWorldPosition"
import { quaternion } from "../utils/reusables"

export default class ThirdPersonCamera extends CharacterCamera {
    public static componentName = "thirdPersonCamera"

    public constructor() {
        super()
        this.innerZ = 300
        this.orbitMode = true

        const cam = this.camera

        this.createEffect(() => {
            const target = this.targetState.get()
            if (target) return
            
            const handle = onBeforeCameraLoop(() => {
                cam.position.copy(getWorldPosition(this.object3d))
                cam.quaternion.copy(this.object3d.getWorldQuaternion(quaternion))
            })
            return () => {
                handle.cancel()
            }
        }, [this.targetState.get])

        import("../core/mixins/PhysicsMixin/enableBVHCamera").then(module => module.default.call(this))
    }
}