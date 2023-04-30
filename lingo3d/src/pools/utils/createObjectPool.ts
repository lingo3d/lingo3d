import { forceGetInstance } from "@lincode/utils"
import { PointType } from "../../utils/isPoint"

export default <
    Type extends object,
    Params extends Array<string | number | boolean | PointType | undefined>,
    Context extends object | void = void
>(
    factory: (params: Params, context: Context) => Type
) => {
    const paramStringObjectArrayMap = new Map<string, Array<Type>>()
    const objectParamStringMap = new WeakMap<Type, string>()
    const releasedObjects = new WeakSet<Type>()

    const request = (
        params: Params,
        paramString = JSON.stringify(params),
        context = undefined as Context
    ): Type => {
        const objectArray = forceGetInstance(
            paramStringObjectArrayMap,
            paramString,
            Array<Type>
        )
        if (objectArray.length) {
            const object = objectArray.pop()!
            releasedObjects.delete(object)
            return object
        }
        const result = factory(params, context)
        objectParamStringMap.set(result, paramString)
        return result
    }

    const release = (object?: Type) => {
        if (!object || releasedObjects.has(object)) return
        releasedObjects.add(object)

        paramStringObjectArrayMap
            .get(objectParamStringMap.get(object)!)!
            .push(object)
    }

    return <const>[request, release]
}
