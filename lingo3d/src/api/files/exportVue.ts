import { upperFirst, kebabCase } from "@lincode/utils"
import serialize from "../serializer/serialize"
import { SceneGraphNode } from "../serializer/types"
import downloadText from "./downloadText"

const serializeVue = (nodes: Array<SceneGraphNode>) => {
    let result = ""
    for (const node of nodes) {
        const componentName = upperFirst(node.type)

        let props = ""
        for (let [key, value] of Object.entries(node)) {
            if (key === "children" || key === "type") continue

            key = kebabCase(key)

            if (typeof value === "string") props += ` ${key}='${value}'`
            else if (value === true) props += ` ${key}`
            else if (typeof value === "object")
                props += ` :${key}='${JSON.stringify(value)}'`
            else props += ` :${key}='${value}'`
        }

        result +=
            "children" in node && node.children
                ? `<${componentName}${props}>\n${serializeVue(
                      node.children
                  )}</${componentName}>\n`
                : `<${componentName}${props} />\n`
    }
    return result
}

export default async () => {
    const prettier = (await import("prettier/standalone")).default
    const parser = (await import("prettier/parser-html")).default

    const code = prettier.format(
        `<template>
            <World>
                ${serializeVue(await serialize())}
            </World>
        </template>`,
        { parser: "vue", plugins: [parser] }
    )

    downloadText("App.vue", code)
}
