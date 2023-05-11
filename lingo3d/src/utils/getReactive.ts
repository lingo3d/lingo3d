import { Reactive } from "@lincode/reactivity"
import { assert, forceGetInstance } from "@lincode/utils"
import unsafeGetValue from "./unsafeGetValue"
import unsafeSetValue from "./unsafeSetValue"

const prototypeDescriptorMap = new WeakMap<
    object,
    Map<string, PropertyDescriptor>
>()

const getPropertyDescriptor = (
    obj: object,
    key: string
): PropertyDescriptor | undefined => {
    if (!obj) return
    const descriptorMap = forceGetInstance(
        prototypeDescriptorMap,
        obj,
        Map<string, PropertyDescriptor>
    )
    if (descriptorMap.has(key)) return descriptorMap.get(key)!
    const desc = Object.getOwnPropertyDescriptor(obj, key)
    if (desc) {
        descriptorMap.set(key, desc)
        return desc
    }
    return getPropertyDescriptor(Object.getPrototypeOf(obj), key)
}

export default (manager: Record<string, any>, key: string): Reactive<any> => {
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
