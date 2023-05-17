import Template from "../../display/Template"
import Appendable from "../../display/core/Appendable"
import { createObjectPtr } from "../../pointers/createObjectPtr"
import { createObjectRecord } from "./createObjectWithoutTemplate"
import { GameObjectType } from "./types"

const record = {
    ...createObjectRecord,
    template: () => new Template()
} satisfies Record<GameObjectType, () => Appendable>

const createObject = <T extends GameObjectType>(
    type: T
): ReturnType<(typeof record)[T]> => record[type]() as any

export default createObject
createObjectPtr[0] = createObject
