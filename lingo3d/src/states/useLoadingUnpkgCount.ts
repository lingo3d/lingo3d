import store from "@lincode/reactivity"

const [setLoadingUnpkgCount, getLoadingUnpkgCount] = store(0)
export { getLoadingUnpkgCount }

export const increaseLoadingUnpkgCount = () =>
    setLoadingUnpkgCount(getLoadingUnpkgCount() + 1)
export const decreaseLoadingUnpkgCount = () =>
    setTimeout(() => setLoadingUnpkgCount(getLoadingUnpkgCount() - 1))
