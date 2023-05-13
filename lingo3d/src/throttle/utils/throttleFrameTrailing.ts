import { addAfterRenderSystemWithArgs } from "../../systems/configSystems/afterRenderSystemWithArgs"

export default <Args extends Array<unknown>>(fn: (...args: Args) => void) =>
    (...args: Args) =>
        addAfterRenderSystemWithArgs(fn, args)
