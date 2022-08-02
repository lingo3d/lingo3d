import store from "@lincode/reactivity"

export type TransformControlsMode = "translate" | "rotate" | "scale" | "select"

export const [setTransformControlsMode, getTransformControlsMode] =
    store<TransformControlsMode>("translate")
