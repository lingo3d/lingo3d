import store from "@lincode/reactivity"

export const [setLoadingUnpkgCount, getLoadingUnpkgCount] = store(0)

export const increaseLoadingUnpkgCount = () =>
    setLoadingUnpkgCount(getLoadingUnpkgCount() + 1)
export const decreaseLoadingUnpkgCount = () =>
    setTimeout(() => setLoadingUnpkgCount(getLoadingUnpkgCount() - 1))
