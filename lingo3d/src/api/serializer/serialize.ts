import { equalsDefaultValue } from "../../interface/utils/getDefaultValue"
import Appendable from "../../display/core/Appendable"
import toFixed, { toFixedPoint } from "./toFixed"
import { AppendableNode, SceneGraphNode } from "./types"
import { VERSION } from "../../globals"
import { isPoint } from "../../typeGuards/isPoint"
import nonSerializedProperties from "./nonSerializedProperties"
import unsafeGetValue from "../../utils/unsafeGetValue"
import Model from "../../display/Model"
import getStaticProperties from "../../display/utils/getStaticProperties"
import { appendableRoot } from "../../collections/appendableRoot"
import { isTemplate } from "../../typeGuards/isTemplate"
import FoundManager from "../../display/core/FoundManager"

const transformProperties = new Set([
    "rotationX",
    "rotationY",
    "rotationZ",
    "scaleX",
    "scaleY",
    "scaleZ",
    "x",
    "y",
    "z"
])

const serialize = (
    children: Array<Appendable | Model> | Set<Appendable | Model>,
    skipUUID: boolean,
    skipTemplateCheck: boolean,
    skipDescendants: boolean
) => {
    const dataParent: Array<AppendableNode> = []
    for (const child of children) {
        if (child.$disableSerialize) continue
        const { componentName, schema } = getStaticProperties(child)

        const data: Record<string, any> = skipTemplateCheck
            ? { type: componentName }
            : isTemplate(child)
            ? { type: "template", source: componentName }
            : { type: componentName }

        const entries =
            componentName === "find" && (child as FoundManager).characterRig
                ? Object.entries(schema).filter(
                      ([key]) => !transformProperties.has(key)
                  )
                : Object.entries(schema)
        for (const [key, type] of entries) {
            if (
                type === Function ||
                (Array.isArray(type) && type.includes(Function)) ||
                nonSerializedProperties.includes(key) ||
                (skipUUID && key === "uuid")
            )
                continue

            let value: any
            if (key === "animations" && "$animationUrls" in child) {
                value = child.$animationUrls
                if (!value) continue
            } else if (key === "animation" && "$animation" in child) {
                value = child.$animation
                if (!value) continue
            } else value = unsafeGetValue(child, key)

            const t = typeof value
            if (equalsDefaultValue(value, child, key) || t === "function")
                continue

            if (t === "number") value = toFixed(value)
            else if (isPoint(value, t)) value = toFixedPoint(value)
            else if (Array.isArray(value) && value.some((v) => isPoint(v)))
                value = value.map((v) => (isPoint(v) ? toFixedPoint(v) : v))

            data[key] = value
        }
        if (!skipDescendants && child.children) {
            const dataChildren = serialize(
                child.children,
                skipUUID,
                skipTemplateCheck,
                skipDescendants
            )
            if (dataChildren.length) data.children = dataChildren
        }
        dataParent.push(data as AppendableNode)
    }
    return dataParent
}

export const serializeAppendable = (
    appendable: Appendable,
    skipUUID = true,
    skipDescendants = false
) => serialize([appendable], skipUUID, true, skipDescendants)[0]

export default (versionStamp?: boolean) => {
    const result: Array<SceneGraphNode> = serialize(
        appendableRoot,
        false,
        false,
        false
    )
    versionStamp && result.unshift({ type: "lingo3d", version: VERSION })
    return result
}
