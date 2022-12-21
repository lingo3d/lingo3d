import store from "@lincode/reactivity"

export const [setGravity, getGravity] = store(-9.81)

export const gravityPtr = [0]
getGravity((val) => (gravityPtr[0] = val))
