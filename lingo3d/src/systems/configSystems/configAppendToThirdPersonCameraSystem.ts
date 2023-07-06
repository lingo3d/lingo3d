import CharacterCamera from "../../display/core/CharacterCamera"
import MeshAppendable from "../../display/core/MeshAppendable"
import { characterCameraSystem } from "../characterCameraSystem"
import { thirdPersonCameraSystem } from "../thirdPersonCameraSystem"
import createInternalSystem, { System } from "../utils/createInternalSystem"

export const configAppendToThirdPersonCameraSystem = createInternalSystem(
    "configAppendToThirdPersonCameraSystem",
    {
        data: { system: undefined as any as System },
        effect: (self: CharacterCamera, data) => {
            const [found] = self.children ?? []
            if (!(found instanceof MeshAppendable)) {
                characterCameraSystem.add(self)
                data.system = characterCameraSystem
                return
            }
            thirdPersonCameraSystem.add(self, { found, lerpCount: 0 })
            data.system = thirdPersonCameraSystem
        },
        cleanup: (self, data) => {
            data.system.delete(self)
        }
    }
)
