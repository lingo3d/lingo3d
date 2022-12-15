import store from "@lincode/reactivity"

const [setPhysXCookingCount, getPhysXCookingCount] = store(0)
export { getPhysXCookingCount }

export const increasePhysXCookingCount = () =>
    setPhysXCookingCount(getPhysXCookingCount() + 1)
export const decreasePhysXCookingCount = () =>
    setPhysXCookingCount(getPhysXCookingCount() - 1)
