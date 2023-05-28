import gameSystem from "./utils/gameSystem"

export const clearNumberPtrSystem = gameSystem({
    update: (numberPtr: Array<number>) => (numberPtr[0] = 0),
    ticker: "afterRender"
})
