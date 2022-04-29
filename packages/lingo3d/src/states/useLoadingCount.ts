import store from "@lincode/reactivity"

export const [setLoadingCount, getLoadingCount] = store(0)

export const increaseLoadingCount = () => setLoadingCount(getLoadingCount() + 1)
export const decreaseLoadingCount = () => setLoadingCount(getLoadingCount() - 1)