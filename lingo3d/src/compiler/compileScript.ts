import { ParseResult } from "@babel/parser"
import Script from "../display/Script"
import { worldPlayPtr } from "../pointers/worldPlayPtr"
import { setScriptCompile } from "../states/useScriptCompile"
import {
    assignScriptSystemNames,
    getScriptSystemNames,
    omitScriptSystemNames
} from "../states/useScriptSystemNames"
import { Node } from "@babel/traverse"
import createSystem from "../systems/utils/createSystem"
import { USE_EDITOR_SYSTEMS } from "../globals"
import { systemsMap } from "../collections/systemsMap"
import { forceGetInstance } from "@lincode/utils"

const eraseFunctionTypes = (path: any) => {
    if (path.node.typeParameters) path.node.typeParameters = undefined
    for (const param of path.node.params) param.typeAnnotation = undefined
    if (path.node.returnType) path.node.returnType = undefined
}

const erasePropertyTypes = (path: any) => {
    if (path.node.typeAnnotation) path.node.typeAnnotation = undefined
}

const eraseClassPropertyTypes = (path: any) => {
    if (path.node.typeAnnotation && path.node.typeAnnotation.typeParameters)
        path.node.typeAnnotation.typeParameters = undefined
    erasePropertyTypes(path)
}

const eraseExpressionTypes = (path: any) => {
    if (path.node.typeArguments) path.node.typeArguments = undefined
}

//@ts-ignore
window.lingo3dCreateSystem = createSystem

export default async (script: Script) => {
    const scriptRuntime = worldPlayPtr[0] === "script"
    scriptRuntime && setScriptCompile({ raw: script.code })

    const { parse } = await import("@babel/parser")
    const { default: generate } = await import("@babel/generator")
    const { default: traverse } = await import("@babel/traverse")

    let ast: ParseResult<any>
    try {
        ast = parse(script.code, {
            sourceType: "module",
            plugins: ["typescript"]
        })
    } catch (error) {
        console.log(error)
        return
    }

    const systemASTs: Record<string, Node> = {}
    const systemNames: Array<string> = []

    traverse(ast, {
        FunctionDeclaration(path) {
            eraseFunctionTypes(path)
        },
        ArrowFunctionExpression(path) {
            eraseFunctionTypes(path)
        },
        CallExpression(path) {
            eraseExpressionTypes(path)
            //@ts-ignore
            const { name, type } = path.node.callee
            if (
                name === "createSystem" &&
                type === "Identifier" &&
                path.scope.hasBinding(name) &&
                //@ts-ignore
                path.scope.getBinding(name).kind === "module"
            ) {
                const firstArgument = path.node.arguments[0]
                if (!firstArgument || firstArgument.type !== "StringLiteral")
                    return

                const secondArgument = path.node.arguments[1]
                if (
                    !secondArgument ||
                    secondArgument.type !== "ObjectExpression"
                )
                    return

                systemASTs[firstArgument.value] = secondArgument
                systemNames.push(firstArgument.value)
            }
        },
        NewExpression(path) {
            eraseExpressionTypes(path)
        },
        ClassDeclaration(path) {
            if (path.node.typeParameters) {
                path.node.typeParameters = undefined
            }
        },
        VariableDeclaration(path) {
            path.node.declarations.forEach((declaration) => {
                //@ts-ignore
                declaration.id.typeAnnotation = undefined
            })
        },
        ClassProperty(path) {
            eraseClassPropertyTypes(path)
        },
        ClassPrivateProperty(path) {
            eraseClassPropertyTypes(path)
        },
        ClassMethod(path) {
            eraseFunctionTypes(path)
        },
        ClassPrivateMethod(path) {
            eraseFunctionTypes(path)
        },
        ObjectProperty(path) {
            erasePropertyTypes(path)
        },
        ObjectMethod(path) {
            eraseFunctionTypes(path)
        },
        TSAsExpression(path) {
            path.replaceWith(path.node.expression)
        },
        ImportDeclaration(path) {
            const importSource = path.node.source.value
            if (importSource !== "lingo3d") return
            const imports = path.node.specifiers.map((specifier) => {
                //@ts-ignore
                const importedName = specifier.imported.name
                const localName = specifier.local.name
                return `const ${localName} = lingo3d.${importedName}`
            })
            path.replaceWithMultiple(
                imports.map((importCode) => parse(importCode).program.body[0])
            )
        }
    })

    if (USE_EDITOR_SYSTEMS) {
        const systemQueuedMap = new Map<string, Array<any>>()
        for (const [name, system] of systemsMap) {
            for (const item of system.queued)
                forceGetInstance(systemQueuedMap, name, Array).push(item)
            system.dispose()
            systemsMap.delete(name)
        }
        for (const [name, ast] of Object.entries(systemASTs)) {
            const system = eval(
                `lingo3dCreateSystem("${name}", ${generate(ast).code})`
            )
            if (!systemQueuedMap.has(name)) continue
            for (const item of systemQueuedMap.get(name)!) system.add(item)
        }
    }
    systemNames.length
        ? assignScriptSystemNames({ [script.uuid]: systemNames })
        : omitScriptSystemNames(script.uuid)

    scriptRuntime && setScriptCompile({ compiled: generate(ast).code })
}
