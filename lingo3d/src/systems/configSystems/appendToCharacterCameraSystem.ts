import CharacterCamera from "../../display/core/CharacterCamera"
import MeshAppendable from "../../display/core/MeshAppendable"
import { characterCameraFollowSystem } from "../characterCameraFollowSystem"
import createInternalSystem from "../utils/createInternalSystem"

export const appendToCharacterCameraSystem = createInternalSystem(
    "appendToCharacterCameraSystem",
    {
        effect: (self: CharacterCamera) => {
            const [found] = self.children ?? []
            if (!(found instanceof MeshAppendable)) return false
            characterCameraFollowSystem.add(self, { found })
        },
        cleanup: (self) => {
            characterCameraFollowSystem.delete(self)
        }
    }
)
