import store from "@lincode/reactivity"

export const [setViewportSize, getViewportSize] = store<
    [number, number] | undefined
>(undefined)
