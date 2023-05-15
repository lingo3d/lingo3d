import Template from "../../display/Template"
import Appendable from "../../display/core/Appendable"
import { createObjectRecord } from "./createObjectWithoutTemplate"
import { GameObjectType } from "./types"

const record = {
    ...createObjectRecord,
    template: () => new Template()
} satisfies Record<GameObjectType, () => Appendable>

export default <T extends GameObjectType>(
    type: T
): ReturnType<(typeof record)[T]> => record[type]() as any
