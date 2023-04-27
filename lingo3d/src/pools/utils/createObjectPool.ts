import { forceGetInstance } from "@lincode/utils"
import { PointType } from "../../utils/isPoint"

export default <
    Type extends object,
    Params extends Array<string | number | boolean | PointType | undefined>,
    Context extends object | void = void
>(
    factory: (params: Params, context: Context) => Type
) => {
    const paramStringObjectSetMap = new Map<string, Set<Type>>()
    const objectParamStringMap = new WeakMap<Type, string>()

    const request = (
        params: Params,
        paramString = JSON.stringify(params),
        context = undefined as Context
    ): Type => {
        const objectSet = forceGetInstance(
            paramStringObjectSetMap,
            paramString,
            Set<Type>
        )
        const [object] = objectSet
        if (object) {
            objectSet.delete(object)
            return object
        }
        const result = factory(params, context)
        objectParamStringMap.set(result, paramString)
        return result
    }

    const release = (object: Type) => {
        const paramString = objectParamStringMap.get(object)!
        const objectSet = paramStringObjectSetMap.get(paramString)!
        objectSet.add(object)
    }

    return <const>[request, release]
}
