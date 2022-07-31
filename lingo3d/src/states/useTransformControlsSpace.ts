import store from "@lincode/reactivity"

export const [setTransformControlsSpace, getTransformControlsSpace] = store<
    "local" | "world"
>("world")
