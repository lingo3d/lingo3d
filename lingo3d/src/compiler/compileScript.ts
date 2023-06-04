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

export default async (script: string) => {
    const { parse } = await import("@babel/parser")
    const { default: generate } = await import("@babel/generator")
    const { default: traverse } = await import("@babel/traverse")

    const ast = parse(script, {
        sourceType: "module",
        plugins: ["typescript"]
    })

    traverse(ast, {
        FunctionDeclaration(path) {
            eraseFunctionTypes(path)
        },
        ArrowFunctionExpression(path) {
            eraseFunctionTypes(path)
        },
        CallExpression(path) {
            if (path.node.typeArguments) {
                path.node.typeArguments = undefined
            }
        },
        NewExpression(path) {
            if (path.node.typeArguments) {
                path.node.typeArguments = undefined
            }
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
    return generate(ast).code
}
