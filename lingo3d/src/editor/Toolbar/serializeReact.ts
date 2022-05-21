import { upperFirst } from "@lincode/utils"
import serialize from "../../display/utils/serializer/serialize"
import { SceneGraphNode } from "../../display/utils/serializer/types"
import saveTextFile from "./saveTextFile"

const serializeReact = (nodes: Array<SceneGraphNode>) => {
    let result = ""
    for (const node of nodes) {
        const componentName = upperFirst(node.type)

        let props = ""
        for (const [key, value] of Object.entries(node)) {
            if (key === "children" || key === "type" || !value)
                continue

            if (typeof value === "string")
                props += ` ${key}="${value}"`
            else if (value === true)
                props += ` ${key}`
            else if (typeof value === "object")
                props += ` ${key}={${JSON.stringify(value)}}`
            else
                props += ` ${key}={${value}}`
        }

        result += "children" in node && node.children
            ? `<${componentName}${props}>${serializeReact(node.children)}</${componentName}>`
            : `<${componentName}${props} />`
    }
    return result
}

export default async () => {
    const prettier = (await import("prettier/standalone")).default
    const parser = (await import("prettier/parser-babel")).default

    const code = prettier.format(`
        const App = () => {
            return (
                <World>
                    ${serializeReact(serialize())}
                </World>
            )
        }
    `, { parser: "babel", plugins: [parser] })
    
    saveTextFile("App.jsx", code)
}