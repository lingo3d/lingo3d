import { sharedPoolReleaseSystem } from "../../systems/configSystems/sharedPoolReleaseSystem"
import { PointType } from "../../utils/isPoint"

export default <
    Type extends object,
    Params extends Array<string | number | boolean | PointType | undefined>,
    Context extends object | void = void
>(
    factory: (params: Params, context: Context) => Type,
    dispose: (instance: Type) => void
) => {
    const paramsInstanceMap = new Map<string, Type>()
    const paramsCountRecord: Record<string, number> = {}
    const objectParamStringMap = new WeakMap<Type, string>()

    const request = (
        params: Params,
        paramString = JSON.stringify(params),
        context = undefined as Context
    ): Type => {
        if (
            (paramsCountRecord[paramString] =
                (paramsCountRecord[paramString] ?? 0) + 1) === 1
        ) {
            const result = factory(params, context)
            objectParamStringMap.set(result, paramString)
            paramsInstanceMap.set(paramString, result)
            return result
        }
        return paramsInstanceMap.get(paramString)!
    }

    const release = (object: Type | undefined | null) =>
        object &&
        sharedPoolReleaseSystem.add(object, {
            objectParamStringMap,
            paramsCountRecord,
            dispose,
            paramsInstanceMap
        })

    return <const>[request, release]
}
