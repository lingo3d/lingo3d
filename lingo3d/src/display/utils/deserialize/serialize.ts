import Appendable, { appendableRoot } from "../../../api/core/Appendable"
import { SceneGraphNode } from "./types"

const traverseAppendable = (
    children: Array<Appendable> | Set<Appendable>
) => {
    const dataParent: Array<SceneGraphNode> = []
    for (const child of children) {
        //@ts-ignore
        const { componentName, schema, defaults } = child.constructor

        const data: Record<string, any> = { type: componentName }
        for (const key of Object.keys(schema)) {
            //@ts-ignore
            let value = child[key]
            if (value === defaults[key] || typeof value === "function") continue
            if (typeof value === "number") value = Number(value.toFixed(2))
            data[key] = value
        }
        child.children && (data.children = traverseAppendable(child.children))
        dataParent.push(data as SceneGraphNode)
    }
    return dataParent
}

export default () => {
    const data = traverseAppendable(appendableRoot)
    console.log(data)
}