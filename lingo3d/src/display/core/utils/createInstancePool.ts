import { Point } from "@lincode/math"

export default <
    Type,
    Params extends Array<string | number | boolean | Point | undefined>,
    Context extends object | void = void
>(
    factory: (params: Params, context: Context) => Type,
    dispose: (instance: Type) => void
) => {
    const paramsInstanceMap = new Map<string, Type>()
    const paramsCountRecord: Record<string, number> = {}
    const defaultParamsInstanceMap = new Map<string, Type>()

    const allocateDefaultInstance = (
        params: Params,
        instance = factory(params, undefined as Context)
    ) => {
        defaultParamsInstanceMap.set(JSON.stringify(params), instance)
        return instance
    }

    const increaseCount = (
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
            paramsInstanceMap.set(paramString, result)
            console.log("increase", paramString, paramsInstanceMap.size)
            return result
        }
        return paramsInstanceMap.get(paramString)!
    }

    const decreaseCount = (params: Params | string) => {
        const paramString =
            typeof params === "string" ? params : JSON.stringify(params)
        const count = (paramsCountRecord[paramString] ?? 0) - 1
        if (count === -1) return
        if (count === 0) {
            dispose(paramsInstanceMap.get(paramString)!)
            paramsInstanceMap.delete(paramString)
            delete paramsCountRecord[paramString]
            console.log("decrease", paramString, paramsInstanceMap.size)
            return
        }
        paramsCountRecord[paramString] = count
    }

    return <const>[increaseCount, decreaseCount, allocateDefaultInstance]
}
