import store from "@lincode/reactivity"

export const [setFileSelected, getFileSelected] = store<File | undefined>(
    undefined
)
