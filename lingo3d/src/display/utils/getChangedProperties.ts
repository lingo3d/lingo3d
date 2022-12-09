import { forceGet } from "@lincode/utils"
import Appendable from "../../api/core/Appendable"
import { FrameValue } from "../../interface/IAnimationManager"
import unsafeGetValue from "../../utils/unsafeGetValue"

const propertiesMap = new WeakMap<Appendable, Array<string>>()
const getProperties = (instance: Appendable) =>
    forceGet(propertiesMap, unsafeGetValue(instance, "constructor"), () => {
        const result: Array<string> = []
        for (const [property, type] of Object.entries(
            unsafeGetValue(instance.constructor, "schema")
        ))
            if (
                type === Boolean ||
                (type === Number &&
                    property !== "rotation" &&
                    property !== "scale")
            )
                result.push(property)

        return result
    })

const saveMap = new WeakMap<Appendable, Record<string, FrameValue>>()
export const saveProperties = (instance: Appendable) => {
    const saved: Record<string, FrameValue> = {}
    for (const property of getProperties(instance))
        saved[property] = unsafeGetValue(instance, property)
    saveMap.set(instance, saved)
}

//property name, from value, to value
export type ChangedProperties = Array<[string, FrameValue, FrameValue]>

export default (instance: Appendable) => {
    const changed: ChangedProperties = []
    const saved = saveMap.get(instance)
    if (!saved) return changed

    for (const property of getProperties(instance)) {
        const value = unsafeGetValue(instance, property)
        saved[property] !== value &&
            changed.push([property, saved[property], value])
    }

    return changed
}
