import { Reactive } from "@lincode/reactivity"
import { assert } from "@lincode/utils"
import unsafeGetValue from "./unsafeGetValue"
import unsafeSetValue from "./unsafeSetValue"

const prototypeDescriptorMap = new WeakMap<object, PropertyDescriptor>()

const getPropertyDescriptor = (
    obj: object,
    key: string,
    traversed: Array<object> = []
): PropertyDescriptor | undefined => {
    if (!obj) return
    if (prototypeDescriptorMap.has(obj)) return prototypeDescriptorMap.get(obj)
    traversed.push(obj)
    const desc = Object.getOwnPropertyDescriptor(obj, key)
    if (desc) {
        for (const obj of traversed) prototypeDescriptorMap.set(obj, desc)
        return desc
    }
    return getPropertyDescriptor(Object.getPrototypeOf(obj), key, traversed)
}

export default (
    manager: Record<string, any>,
    key: string,
    verbose?: boolean
): Reactive<any> => {
    const stateKey = `${key}State`
    let reactive = unsafeGetValue(manager, stateKey)
    if (reactive) return reactive

    unsafeSetValue(
        manager,
        stateKey,
        (reactive = new Reactive<any>(unsafeGetValue(manager, key)))
    )

    const desc = getPropertyDescriptor(manager, key)
    assert(desc, `Property "${key}" not found`)

    verbose && console.log("property descriptor", manager, key, desc)

    if ("value" in desc)
        Object.defineProperty(manager, key, {
            get() {
                return reactive.get()
            },
            set(value) {
                reactive.set(value)
            }
        })
    else
        Object.defineProperty(manager, key, {
            get() {
                return desc.get!.call(manager)
            },
            set(value) {
                reactive.set(value)
                desc.set!.call(manager, value)
            }
        })
    return reactive
}
