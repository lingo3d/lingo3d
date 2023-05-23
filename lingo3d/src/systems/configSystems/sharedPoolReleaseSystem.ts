import configLoadedSystemWithData from "../utils/configLoadedSystemWithData"

type Type = object

export const [addSharedPoolReleaseSystem] = configLoadedSystemWithData(
    (
        object: Type,
        data: {
            objectParamStringMap: WeakMap<Type, string>
            paramsCountRecord: Record<string, number>
            paramsInstanceMap: Map<string, Type>
            dispose: (instance: any) => void
        }
    ) => {
        const paramString = data.objectParamStringMap.get(object)
        if (!paramString) return
        const count = (data.paramsCountRecord[paramString] ?? 0) - 1
        if (count === -1) return
        if (count === 0) {
            data.dispose(data.paramsInstanceMap.get(paramString)!)
            data.paramsInstanceMap.delete(paramString)
            delete data.paramsCountRecord[paramString]
            return
        }
        data.paramsCountRecord[paramString] = count
    }
)
