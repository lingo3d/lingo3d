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
    const defaultParamsInstanceMap = new Map<string, Type>()
    const objectParamStringMap = new WeakMap<Type, string>()

    const allocateDefaultInstance = (
        params: Params,
        instance = factory(params, undefined as Context)
    ) => {
        const paramString = JSON.stringify(params)
        objectParamStringMap.set(instance, paramString)
        defaultParamsInstanceMap.set(paramString, instance)
        return instance
    }

    const request = (
        params: Params,
        paramString = JSON.stringify(params),
        context = undefined as Context
    ): Type => {
        const defaultInstance = defaultParamsInstanceMap.get(paramString)
        if (defaultInstance) return defaultInstance
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

    const release = (params: Params | string | Type) => {
        const paramString =
            typeof params === "string"
                ? params
                : Array.isArray(params)
                ? JSON.stringify(params)
                : objectParamStringMap.get(params)!
        const count = (paramsCountRecord[paramString] ?? 0) - 1
        if (count === -1) return
        if (count === 0) {
            dispose(paramsInstanceMap.get(paramString)!)
            paramsInstanceMap.delete(paramString)
            delete paramsCountRecord[paramString]
            return
        }
        paramsCountRecord[paramString] = count
    }

    return <const>[request, release, allocateDefaultInstance]
}
