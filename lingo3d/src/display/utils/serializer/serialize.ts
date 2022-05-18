import { omit } from "@lincode/utils"
import Appendable, { appendableRoot } from "../../../api/core/Appendable"
import settings from "../../../api/settings"
import { setupDefaults } from "../../../interface/ISetup"
import { nonSerializedProperties, nonSerializedSettings, SceneGraphNode, SetupNode } from "./types"

const serialize = (children: Array<any> | Set<any>) => {
    const dataParent: Array<SceneGraphNode> = []
    for (const child of children) {
        const { componentName, schema, defaults } = child.constructor

        const data: Record<string, any> = { type: componentName }
        for (const key of Object.keys(schema)) {
            if (nonSerializedProperties.includes(key))
                continue

            let value: any
            if (key === "animations") {
                value = child.loadedAnims
                if (!value) continue
            }
            else if (key === "animation") {
                value = child.animationName
                if (value === undefined) continue
            }
            else value = child[key]
            
            if (value === defaults[key] || typeof value === "function") continue
            if (typeof value === "number") value = Number(value.toFixed(2))
            data[key] = value
        }
        child.children && (data.children = serialize(child.children))
        dataParent.push(data as SceneGraphNode)
    }
    return dataParent
}

export default (children: Array<Appendable> | Set<Appendable> | Appendable = appendableRoot) => {
    const data = serialize(children instanceof Appendable? [children] : children)

    const settingsDiff: SetupNode = { type: "setup" }
    for (const [key, value] of Object.entries(omit(settings, nonSerializedSettings)))
        //@ts-ignore
        if (setupDefaults[key] !== value)
            //@ts-ignore
            settingsDiff[key] = value

    if (Object.keys(settingsDiff).length)
        data.push(settingsDiff)

    return data
}