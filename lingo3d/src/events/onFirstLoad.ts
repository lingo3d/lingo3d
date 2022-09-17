import { event } from "@lincode/events"
import { debounce } from "@lincode/utils"
import { getLoadingCount } from "../states/useLoadingCount"

const [emitFirstLoad, onFirstLoad] = event()
export { onFirstLoad }

const handle = getLoadingCount(
    debounce(
        (loadingCount: number) => {
            if (loadingCount) return
            handle.cancel()
            emitFirstLoad()
        },
        1000,
        "trailing"
    )
)
