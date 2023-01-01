import store, { decrease, increase } from "@lincode/reactivity"

const [setLoadingCount, getLoadingCount] = store(0)
export { getLoadingCount }

export const increaseLoadingCount = increase(setLoadingCount, getLoadingCount)
const _decreaseLoadingCount = decrease(setLoadingCount, getLoadingCount)
export const decreaseLoadingCount = () => setTimeout(_decreaseLoadingCount)
