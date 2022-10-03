import { Cancellable } from "@lincode/promiselikes"
import { Object3D } from "three"
import { onAfterRenderSSR } from "../../../events/onAfterRenderSSR"
import { onBeforeRenderSSR } from "../../../events/onBeforeRenderSSR"

export default (helper: Object3D) => {
    const handle = new Cancellable()
    handle.watch(onBeforeRenderSSR(() => (helper.visible = false)))
    handle.watch(onAfterRenderSSR(() => (helper.visible = true)))
    return handle
}
