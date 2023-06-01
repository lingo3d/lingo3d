import createInternalSystem from "../utils/createInternalSystem"

export const sharedPoolReleaseSystem = createInternalSystem(
    "sharedPoolReleaseSystem",
    {
        data: {} as {
            objectParamStringMap: WeakMap<object, string>
            paramsCountRecord: Record<string, number>
            paramsInstanceMap: Map<string, object>
            dispose: (instance: any) => void
        },
        effect: (object, data) => {
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
    }
)
