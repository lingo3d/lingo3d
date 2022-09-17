import store from "@lincode/reactivity"

const [setBVHComputing, getBVHComputing] = store(0)
export { getBVHComputing }

export const increaseBVHComputing = () => setBVHComputing(getBVHComputing() + 1)
export const decreaseBVHComputing = () => setBVHComputing(getBVHComputing() - 1)
