import { Object3D, PerspectiveCamera } from "three"
import scene from "../../engine/scene"
import ICharacterCamera, {
    characterCameraDefaults,
    characterCameraSchema,
    LockTargetRotationValue
} from "../../interface/ICharacterCamera"
import { FAR, NEAR } from "../../globals"
import CameraBase from "./CameraBase"
import MeshAppendable from "../../api/core/MeshAppendable"
import {
    addCharacterCameraFollowSystem,
    deleteCharacterCameraFollowSystem
} from "../../systems/characterCameraFollowSystem"
import { TransformControlsPayload } from "../../events/onTransformControls"

export default class CharacterCamera
    extends CameraBase
    implements ICharacterCamera
{
    public static defaults = characterCameraDefaults
    public static schema = characterCameraSchema

    public constructor() {
        super(new PerspectiveCamera(75, 1, NEAR, FAR))

        const midObject3d = (this.midObject3d = new Object3D())
        this.outerObject3d.add(midObject3d)
        midObject3d.add(this.object3d)

        scene.attach(this.$camera)

        this.createEffect(() => {
            const found = this.firstChildState.get()
            if (!(found instanceof MeshAppendable)) return

            addCharacterCameraFollowSystem(this, { found })
            return () => {
                deleteCharacterCameraFollowSystem(this)
            }
        }, [this.firstChildState.get])

        this.createEffect(() => {
            const found = this.firstChildState.get()
            if (!(found instanceof MeshAppendable)) return

            let { lockTargetRotation } = this
            const handle = found.$events.on(
                "transformEdit",
                ({ phase, mode }: TransformControlsPayload) => {
                    if (mode !== "rotate") return
                    if (phase === "start") {
                        lockTargetRotation = this.lockTargetRotation
                        this.lockTargetRotation = "follow"
                        return
                    }
                    this.lockTargetRotation = lockTargetRotation
                }
            )
            return () => {
                handle.cancel()
            }
        }, [this.firstChildState.get])
    }

    protected override disposeNode() {
        super.disposeNode()
        scene.remove(this.$camera)
    }

    public lockTargetRotation: LockTargetRotationValue = true

    public override append(object: MeshAppendable) {
        this.$appendNode(object)
        object.outerObject3d.parent !== scene &&
            scene.attach(object.outerObject3d)
    }

    public override attach(object: MeshAppendable) {
        this.append(object)
    }
}
