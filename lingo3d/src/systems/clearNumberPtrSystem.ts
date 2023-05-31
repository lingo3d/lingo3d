import createSystem from "./utils/createSystem"

export const clearNumberPtrSystem = createSystem("clearNumberPtrSystem", {
    update: (numberPtr: Array<number>) => (numberPtr[0] = 0),
    ticker: "afterRender"
})
