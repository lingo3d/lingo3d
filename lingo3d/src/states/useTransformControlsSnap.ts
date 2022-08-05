import store from "@lincode/reactivity"

export const [setTransformControlsSnap, getTransformControlsSnap] = store<
    number | null
>(null)
