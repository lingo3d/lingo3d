import { Class, forceGet } from "@lincode/utils"

const classMapsMap = new WeakMap<
    Class,
    [Map<string, unknown>, Record<string, number>]
>()
const classDefaultParamsInstanceMap = new WeakMap<Class, [string, any]>()

const makeTuple = () =>
    <const>[new Map<string, any>(), {} as Record<string, number>]

export default <T, Params = Array<any> | ReadonlyArray<any>>(
    factory: (ClassVal: Class<T>, params: Params) => T
) => {
    const allocateDefaultInstance = (ClassVal: Class<T>, params: Params) => {
        const instance = factory(ClassVal, params)
        classDefaultParamsInstanceMap.set(ClassVal, [
            JSON.stringify(params),
            instance
        ])
        return instance
    }

    const increaseCount = (ClassVal: Class<T>, params: Params): T => {
        const paramString = JSON.stringify(params)

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

    const decreaseCount = (ClassVal: Class<T>, params: Params) => {
        const [paramsInstanceMap, paramCountRecord] = forceGet(
            classMapsMap,
            ClassVal,
            makeTuple
        )
        const paramString = JSON.stringify(params)
        const count = (paramCountRecord[paramString] ?? 0) - 1
        if (count === -1) return
        if (count === 0) {
            paramsInstanceMap.get(paramString).dispose()
            paramsInstanceMap.delete(paramString)
            delete paramCountRecord[paramString]
            return
        }
        paramCountRecord[paramString] = count
    }

    return <const>[increaseCount, decreaseCount, allocateDefaultInstance]
}
