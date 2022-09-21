import { objectURLFileMap } from "../../display/core/utils/objectURL"
import Setup from "../../display/Setup"
import getDefaultValue from "../../interface/utils/getDefaultValue"
import { getFileCurrent } from "../../states/useFileCurrent"
import Appendable, {
    appendableRoot,
    hiddenAppendables
} from "../core/Appendable"
import settings from "../settings"
import relativePath from "../path/relativePath"
import toFixed from "./toFixed"
import { nonSerializedProperties, SceneGraphNode } from "./types"
import { VERSION } from "../../globals"

const serialize = async (children: Array<any>) => {
    const dataParent: Array<SceneGraphNode> = []
    for (const child of children) {
        if (hiddenAppendables.has(child)) continue

        const { componentName, schema, defaults } = child.constructor

        const data: Record<string, any> = { type: componentName }
        for (const [key, type] of Object.entries(schema)) {
            if (
                type === Function ||
                (Array.isArray(type) && type.includes(Function)) ||
                nonSerializedProperties.includes(key)
            )
                continue

            let value: any
            if (key === "animations") {
                value = child.serializeAnimations
                if (!value) continue
            } else if (key === "animation") {
                value = child.serializeAnimation
                if (value === undefined) continue
            } else value = child[key]

            const t = typeof value
            if (value === getDefaultValue(defaults, key) || t === "function")
                continue

            const fileCurrent = getFileCurrent()
            if (
                t === "string" &&
                value.startsWith("blob:http") &&
                fileCurrent
            ) {
                const file = objectURLFileMap.get(value)!
                value = relativePath(
                    fileCurrent.webkitRelativePath,
                    file.webkitRelativePath
                )
            } else if (t === "number") value = toFixed(key, value)

            data[key] = value
        }
        child.children && (data.children = await serialize(child.children))
        dataParent.push(data as SceneGraphNode)
    }
    return dataParent
}

export default async (
    children: Array<Appendable> | Set<Appendable> | Appendable = appendableRoot
) => {
    if (children instanceof Appendable) return serialize([children])

    const childs: Array<Appendable> = []
    for (const child of children)
        !(child instanceof Setup) && childs.push(child)

    const setup = new Setup(true)
    Object.assign(setup, settings)
    childs.push(setup)

    const result = await serialize(childs)
    result.unshift({ type: "lingo3d", version: VERSION })

    setup.dispose()
    return result
}
