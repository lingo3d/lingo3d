import CharacterRig from "../../display/CharacterRig"
import Model from "../../display/Model"
import createInternalSystem from "../utils/createInternalSystem"

export const appendToCharacterRigSystem = createInternalSystem(
    "appendToCharacterRigSystem",
    {
        update: (self: CharacterRig) => {
            const [found] = self.children ?? []
            console.log(found)

            if (!(found instanceof Model)) {
                appendToCharacterRigSystem.delete(self)
                return
            }
            if (!found.$loadedObject) return
            appendToCharacterRigSystem.delete(self)

            self.target = found.uuid

            console.log("here")

            // parseCharacter(found.$loadedObject)
        }
    }
)
