import { destroyPtr } from "../../../../pointers/destroyPtr"

export default (target: any) => {
    if ("release" in target) {
        target.release()
        return
    }
    destroyPtr[0](target)
}
