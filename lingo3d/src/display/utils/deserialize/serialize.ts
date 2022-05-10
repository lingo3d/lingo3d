import Appendable, { appendableRoot } from "../../../api/core/Appendable"
import { SceneGraphNode } from "./types"

const serialize = (children: Array<any> | Set<any>) => {
    const dataParent: Array<SceneGraphNode> = []
    for (const child of children) {
        const { componentName, schema, defaults } = child.constructor

        const data: Record<string, any> = { type: componentName }
        for (const key of Object.keys(schema)) {
            if (key === "velocity" || key === "target") continue

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

export default (children: Array<Appendable> | Set<Appendable> | Appendable = appendableRoot) => (
    serialize(children instanceof Appendable? [children] : children)
)