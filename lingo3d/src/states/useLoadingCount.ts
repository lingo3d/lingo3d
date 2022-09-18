import store from "@lincode/reactivity"

const [setLoadingCount, getLoadingCount] = store(0)
export { getLoadingCount }

export const increaseLoadingCount = () => setLoadingCount(getLoadingCount() + 1)
export const decreaseLoadingCount = () => setTimeout(() => setLoadingCount(getLoadingCount() - 1))
