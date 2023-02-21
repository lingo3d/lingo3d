import IThirdPersonCamera, {
    thirdPersonCameraDefaults,
    thirdPersonCameraSchema
} from "../../interface/IThirdPersonCamera"
import CharacterCamera, {
    addCharacterCameraSystem,
    deleteCharacterCameraSystem
} from "../core/CharacterCamera"
import { managerActorPtrMap } from "../core/PhysicsObjectManager/physx/pxMaps"
import {
    assignPxVec,
    assignPxVec_
} from "../core/PhysicsObjectManager/physx/pxMath"
import getWorldDirection from "../utils/getWorldDirection"
import getWorldPosition from "../utils/getWorldPosition"
import getWorldQuaternion from "../utils/getWorldQuaternion"
import MeshAppendable from "../../api/core/MeshAppendable"
import { physxPtr } from "../core/PhysicsObjectManager/physx/physxPtr"
import { getEditorHelper } from "../../states/useEditorHelper"
import renderSystemWithData from "../../utils/renderSystemWithData"
import fpsAlpha from "../utils/fpsAlpha"
import { vector3_ } from "../utils/reusables"

const setVisible = (target: MeshAppendable, visible: boolean) =>
    "visible" in target && (target.visible = visible)

const [addCameraSystem, deleteCameraSystem] = renderSystemWithData(
    (
        self: ThirdPersonCamera,
        data: { found: MeshAppendable; tooClose: boolean }
    ) => {
        const cam = self.camera

        const { innerZ } = self
        self.innerZ = 0
        const origin = self.object3d.getWorldPosition(vector3_)
        self.innerZ = innerZ

        const position = getWorldPosition(self.object3d)

        const pxHit = physxPtr[0].pxRaycast?.(
            assignPxVec(origin),
            assignPxVec_(getWorldDirection(self.object3d)),
            position.distanceTo(origin),
            managerActorPtrMap.get(data.found)
        )
        if (pxHit) {
            pxHit.position.y += 0.1
            cam.position.lerp(pxHit.position, fpsAlpha(0.2))
        } else cam.position.copy(position)

        cam.quaternion.copy(getWorldQuaternion(self.object3d))

        const tooClose = getEditorHelper()
            ? false
            : cam.position.distanceTo(origin) < 1
        tooClose !== data.tooClose && setVisible(data.found, !tooClose)
        data.tooClose = tooClose
    }
)

export default class ThirdPersonCamera
    extends CharacterCamera
    implements IThirdPersonCamera
{
    public static componentName = "thirdPersonCamera"
    public static override defaults = thirdPersonCameraDefaults
    public static override schema = thirdPersonCameraSchema

    public constructor() {
        super()
        this.innerZ = 300
        this.orbitMode = true

        this.createEffect(() => {
            const found = this.firstChildState.get()
            if (!(found instanceof MeshAppendable)) {
                addCharacterCameraSystem(this)
                return () => {
                    deleteCharacterCameraSystem(this)
                }
            }
            setVisible(found, true)
            addCameraSystem(this, { found, tooClose: false })
            return () => {
                deleteCameraSystem(this)
            }
        }, [this.firstChildState.get])
    }
}
