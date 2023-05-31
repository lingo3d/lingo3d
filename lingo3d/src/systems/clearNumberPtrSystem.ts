import createSystem from "./utils/createInternalSystem"

export const clearNumberPtrSystem = createSystem("clearNumberPtrSystem", {
    update: (numberPtr: Array<number>) => (numberPtr[0] = 0),
    ticker: "afterRender"
})
