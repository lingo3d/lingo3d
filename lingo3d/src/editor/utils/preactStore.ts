import store from "@lincode/reactivity"
import hook from "./hook"

export default <T>(val: T) => {
    const [setter, getter] = store(val)
    return hook(setter, getter)
}
