import store, { decrease, increase } from "@lincode/reactivity"

const [setLoadingUnpkgCount, getLoadingUnpkgCount] = store(0)
export { getLoadingUnpkgCount }

export const increaseLoadingUnpkgCount = increase(
    setLoadingUnpkgCount,
    getLoadingUnpkgCount
)
const _decreaseLoadingUnpkgCount = decrease(
    setLoadingUnpkgCount,
    getLoadingUnpkgCount
)
export const decreaseLoadingUnpkgCount = () =>
    setTimeout(_decreaseLoadingUnpkgCount)
