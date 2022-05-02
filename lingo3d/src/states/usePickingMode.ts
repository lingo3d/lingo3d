import store from "@lincode/reactivity"

export const [setPickingMode, getPickingMode] = store<"mouse" | "camera">("mouse")