import createInternalSystem from "./utils/createInternalSystem"

export const clearNumberPtrSystem = createInternalSystem(
    "clearNumberPtrSystem",
    {
        update: (numberPtr: Array<number>) => (numberPtr[0] = 0),
        updateTicker: "afterRender"
    }
)
