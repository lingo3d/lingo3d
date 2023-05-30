import createSystem from "./utils/createSystem"

export const clearNumberPtrSystem = createSystem({
    update: (numberPtr: Array<number>) => (numberPtr[0] = 0),
    ticker: "afterRender"
})
