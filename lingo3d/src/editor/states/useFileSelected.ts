import preactStore from "../utils/preactStore"

export const [useFileSelected, setFileSelected] = preactStore<File | undefined>(
    undefined
)
