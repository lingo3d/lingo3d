import store from "@lincode/reactivity"

export const [setTransformControlsMode, getTransformControlsMode] = store<"translate" | "rotate" | "scale">("translate")