import { DefaultLoadingManager } from "three"

export default (cb?: (url: string) => string) => {
    DefaultLoadingManager.setURLModifier(cb)
}
