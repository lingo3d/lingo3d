import { GameObjectType } from "../../api/serializer/types"
import Defaults from "../../interface/utils/Defaults"
import Appendable from "../core/Appendable"

type Result = {
    schema: any
    defaults: Defaults<any>
    componentName: GameObjectType
}

export default (manager: Appendable): Result => {
    const { schema, defaults, componentName } = manager.constructor as any
    return { schema, defaults, componentName }
}
