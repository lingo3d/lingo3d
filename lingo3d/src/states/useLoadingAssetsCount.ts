import store, { decrease, increase } from "@lincode/reactivity"

const [setLoadingAssetsCount, getLoadingAssetsCount] = store(0)
export { getLoadingAssetsCount }

export const increaseLoadingAssetsCount = increase(
    setLoadingAssetsCount,
    getLoadingAssetsCount
)
const _decreaseLoadingAssetsCount = decrease(
    setLoadingAssetsCount,
    getLoadingAssetsCount
)
export const decreaseLoadingAssetsCount = () =>
    setTimeout(_decreaseLoadingAssetsCount)
