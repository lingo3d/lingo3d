import store from "@lincode/reactivity"
import { debounce } from "@lincode/utils"
import { getLoadingCount } from "./useLoadingCount"

export const [setFirstLoad, getFirstLoad] = store(false)

const handle = getLoadingCount(
    debounce(
        (loadingCount: number) => {
            if (loadingCount) return
            handle.cancel()
            setFirstLoad(true)
        },
        1000,
        "trailing"
    )
)