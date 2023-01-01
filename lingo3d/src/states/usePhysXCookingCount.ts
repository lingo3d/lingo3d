import store, { decrease, increase } from "@lincode/reactivity"

const [setPhysXCookingCount, getPhysXCookingCount] = store(0)
export { getPhysXCookingCount }

export const increasePhysXCookingCount = increase(
    setPhysXCookingCount,
    getPhysXCookingCount
)
export const decreasePhysXCookingCount = decrease(
    setPhysXCookingCount,
    getPhysXCookingCount
)
