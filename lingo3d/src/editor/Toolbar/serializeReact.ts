import { upperFirst } from "@lincode/utils"
import serialize from "../../display/utils/serializer/serialize"
import { SceneGraphNode } from "../../display/utils/serializer/types"
import makeIndent from "./makeIndent"
import saveTextFile from "./saveTextFile"

const serializeReact = (nodes: Array<SceneGraphNode>, level: number) => {
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
            ? `${makeIndent(level)}<${componentName}${props}>\n${serializeReact(node.children, level + 1)}${makeIndent(level)}</${componentName}>\n`
            : `${makeIndent(level)}<${componentName}${props} />\n`
    }
    return result
}

export default () => {
    const code = 
`const App = () => {
    return <>
${serializeReact(serialize(), 2)}    </>
}`
    saveTextFile("App.jsx", code)
}