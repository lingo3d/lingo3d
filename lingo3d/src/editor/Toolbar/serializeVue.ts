import { upperFirst } from "@lincode/utils"
import { kebabCase } from "lodash"
import serialize from "../../display/utils/serializer/serialize"
import { SceneGraphNode } from "../../display/utils/serializer/types"
import saveTextFile from "./saveTextFile"

const serializeVue = (nodes: Array<SceneGraphNode>) => {
    let result = ""
    for (const node of nodes) {
        const componentName = upperFirst(node.type)

        let props = ""
        for (let [key, value] of Object.entries(node)) {
            if (key === "children" || key === "type" || !value)
                continue

            key = kebabCase(key)

            if (typeof value === "string")
                props += ` ${key}='${value}'`
            else if (value === true)
                props += ` ${key}`
            else if (typeof value === "object")
                props += ` :${key}='${JSON.stringify(value)}'`
            else
                props += ` :${key}='${value}'`
        }

        result += "children" in node && node.children
            ? `<${componentName}${props}>\n${serializeVue(node.children)}</${componentName}>\n`
            : `<${componentName}${props} />\n`
    }
    return result
}

export default async () => {
    const prettier = (await import("prettier/standalone")).default
    const parser = (await import("prettier/parser-html")).default

    const code = prettier.format(`
        <template>
            <World>
                ${serializeVue(serialize())}
            </World>
        </template>
    `, { parser: "vue", plugins: [parser] })

    saveTextFile("App.vue", code)
}