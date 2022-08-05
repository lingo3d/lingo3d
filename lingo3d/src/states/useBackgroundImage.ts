import store from "@lincode/reactivity"

export const [setBackgroundImage, getBackgroundImage] = store<
    string | undefined
>(undefined)
