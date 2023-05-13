import { addAfterRenderSystemWithArgs } from "../../systems/configSystems/afterRenderSystemWithArgs"

export default (fn: (...args: Array<unknown>) => void) =>
    (...args: Array<unknown>) =>
        addAfterRenderSystemWithArgs(fn, args)
