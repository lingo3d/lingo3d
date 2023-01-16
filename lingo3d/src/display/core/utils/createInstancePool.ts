import { Class, forceGet } from "@lincode/utils"

const makeTuple = () =>
    <const>[new Map<string, any>(), {} as Record<string, number>]

export default <T, Params = Array<any> | ReadonlyArray<any>>(
    factory: (ClassVal: Class<T>, params: Params) => T,
    dispose = (target: any) => target.dispose()
) => {
    const classMapsMap = new WeakMap<
        Class<T>,
        [Map<string, unknown>, Record<string, number>]
    >()
    const classDefaultParamsInstanceMap = new WeakMap<Class<T>, [string, any]>()

    const allocateDefaultInstance = (
        ClassVal: Class<T>,
        params: Params,
        instance = factory(ClassVal, params)
    ) => {
        classDefaultParamsInstanceMap.set(ClassVal, [
            JSON.stringify(params),
            instance
        ])
        return instance
    }

    const increaseCount = (
        ClassVal: Class<T>,
        params: Params,
        paramString = JSON.stringify(params)
    ): T => {
        const defaultTuple = classDefaultParamsInstanceMap.get(ClassVal)
        if (defaultTuple && paramString === defaultTuple[0])
            return defaultTuple[1]

        const [paramsInstanceMap, paramCountRecord] = forceGet(
            classMapsMap,
            ClassVal,
            makeTuple
        )
        if (
            (paramCountRecord[paramString] =
                (paramCountRecord[paramString] ?? 0) + 1) === 1
        ) {
            const result = factory(ClassVal, params)
            paramsInstanceMap.set(paramString, result)
            return result
        }
        return paramsInstanceMap.get(paramString)
    }

    const decreaseCount = (ClassVal: Class<T>, params: Params | string) => {
        const [paramsInstanceMap, paramCountRecord] = forceGet(
            classMapsMap,
            ClassVal,
            makeTuple
        )
        const paramString =
            typeof params === "string" ? params : JSON.stringify(params)
        const count = (paramCountRecord[paramString] ?? 0) - 1
        if (count === -1) return
        if (count === 0) {
            dispose(paramsInstanceMap.get(paramString))
            paramsInstanceMap.delete(paramString)
            delete paramCountRecord[paramString]
            return
        }
        paramCountRecord[paramString] = count
    }

    return <const>[increaseCount, decreaseCount, allocateDefaultInstance]
}
