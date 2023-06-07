import { ParseResult } from "@babel/parser"
import Script from "../display/Script"
import { worldPlayPtr } from "../pointers/worldPlayPtr"
import { setScriptCompile } from "../states/useScriptCompile"
import { Node } from "@babel/traverse"
import createSystem from "../systems/utils/createSystem"
import { USE_EDITOR_SYSTEMS } from "../globals"
import { systemsMap } from "../collections/systemsMap"
import { forceGetInstance } from "@lincode/utils"
import { scriptUUIDSystemNamesMap } from "../collections/scriptUUIDSystemNamesMap"

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

const eraseTypes = {
    FunctionDeclaration: eraseFunctionTypes,
    ArrowFunctionExpression: eraseFunctionTypes,
    NewExpression: eraseExpressionTypes,
    CallExpression: eraseExpressionTypes,
    ClassDeclaration(path: any) {
        if (path.node.typeParameters) {
            path.node.typeParameters = undefined
        }
    },
    VariableDeclaration(path: any) {
        path.node.declarations.forEach((declaration: any) => {
            declaration.id.typeAnnotation = undefined
        })
    },
    ClassProperty: eraseClassPropertyTypes,
    ClassPrivateProperty: eraseClassPropertyTypes,
    ClassMethod: eraseFunctionTypes,
    ClassPrivateMethod: eraseFunctionTypes,
    ObjectProperty: erasePropertyTypes,
    ObjectMethod: eraseFunctionTypes,
    TSAsExpression(path: any) {
        path.replaceWith(path.node.expression)
    }
}

const systemOptionKeys = [
    "data",
    "effect",
    "cleanup",
    "update",
    "updateTicker",
    "effectTicker",
    "beforeTick",
    "afterTick",
    "sort"
]
const systemOptionKeySet = new Set(systemOptionKeys)

//@ts-ignore
window.lingo3dCreateSystem = createSystem

const createSystems = (
    script: Script,
    codeRecordFactory: () => Record<string, string>
) => {
    const systemQueuedMap = new Map<string, Array<any>>()
    if (scriptUUIDSystemNamesMap.has(script.uuid))
        for (const name of scriptUUIDSystemNamesMap.get(script.uuid)!) {
            const system = systemsMap.get(name)!
            for (const item of system.queued)
                forceGetInstance(systemQueuedMap, name, Array).push(item)
            system.dispose()
            systemsMap.delete(name)
        }
    for (const [name, code] of Object.entries(codeRecordFactory())) {
        const system = eval(code)
        if (!systemQueuedMap.has(name)) continue
        for (const item of systemQueuedMap.get(name)!) system.add(item)
    }
}

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

    const convertExportsToSystemOptionsNodes = new Map<string, Node>()

    traverse(ast, {
        ...eraseTypes,
        CallExpression(path: any) {
            eraseExpressionTypes(path)

            if (script.type !== "script") return

            const { name, type } = path.node.callee
            if (
                name === "createSystem" &&
                type === "Identifier" &&
                path.scope.hasBinding(name) &&
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
        },
        ...(script.type === "system" && {
            ExportNamedDeclaration(path) {
                const declaration = path.node.declaration
                if (!declaration || declaration.type !== "VariableDeclaration")
                    return

                const variableDeclarator = declaration.declarations[0]
                //@ts-ignore
                const identifier = variableDeclarator.id.name
                if (!systemOptionKeySet.has(identifier)) return

                const functionExpressionNode = variableDeclarator.init
                if (
                    functionExpressionNode?.type !==
                        "ArrowFunctionExpression" &&
                    functionExpressionNode?.type !== "FunctionExpression"
                )
                    return

                convertExportsToSystemOptionsNodes.set(
                    identifier,
                    functionExpressionNode
                )
                path.remove()
            }
        })
    })
    if (USE_EDITOR_SYSTEMS) {
        if (script.type === "script")
            createSystems(script, () => {
                const codeRecord: Record<string, string> = {}
                for (const [name, ast] of Object.entries(systemASTs))
                    codeRecord[name] = `lingo3dCreateSystem("${name}", ${
                        generate(ast).code
                    })`
                return codeRecord
            })
        else {
            const { name } = script
            systemNames.push(name!)

            const systemAST = parse(
                `lingo3dCreateSystem("${name}", {${systemOptionKeys.join(
                    ":undefined,"
                )}:undefined})`
            )
            traverse(systemAST, {
                ...eraseTypes,
                ObjectProperty(path) {
                    erasePropertyTypes(path)
                    const targetNode = convertExportsToSystemOptionsNodes.get(
                        //@ts-ignore
                        path.node.key.name
                    )
                    targetNode && path.get("value").replaceWith(targetNode)
                }
            })
            createSystems(script, () => ({
                [name!]: generate(ast).code + "\n" + generate(systemAST).code
            }))
        }
    }
    systemNames.length
        ? scriptUUIDSystemNamesMap.set(script.uuid, systemNames)
        : scriptUUIDSystemNamesMap.delete(script.uuid)

    scriptRuntime && setScriptCompile({ compiled: "" })
}
