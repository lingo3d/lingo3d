export default async (script: string) => {
    const { parse } = await import("@babel/parser")
    const { default: generate } = await import("@babel/generator")
    const { default: traverse } = await import("@babel/traverse")

    const ast = parse(script, {
        sourceType: "module",
        plugins: ["typescript"]
    })

    // Traverse the AST and remove type annotations
    traverse(ast, {
        // Remove type annotations from function parameters and return types
        FunctionDeclaration(path) {
            if (path.node.typeParameters) {
                path.node.typeParameters = undefined
            }
            path.node.params.forEach((param) => {
                param.typeAnnotation = undefined
            })
            if (path.node.returnType) {
                path.node.returnType = undefined
            }
        },
        // Remove type annotations from function expressions
        ArrowFunctionExpression(path) {
            if (path.node.typeParameters) {
                path.node.typeParameters = undefined
            }
            path.node.params.forEach((param) => {
                param.typeAnnotation = undefined
            })
            if (path.node.returnType) {
                path.node.returnType = undefined
            }
        },
        // Remove type arguments from function calls
        CallExpression(path) {
            if (path.node.typeArguments) {
                path.node.typeArguments = undefined
            }
        },
        // Remove type arguments from class instantiation
        NewExpression(path) {
            if (path.node.typeArguments) {
                path.node.typeArguments = undefined
            }
        },
        // Remove type parameters from class declarations
        ClassDeclaration(path) {
            if (path.node.typeParameters) {
                path.node.typeParameters = undefined
            }
        },
        // Remove type annotations from variable declarations
        VariableDeclaration(path) {
            path.node.declarations.forEach((declaration) => {
                //@ts-ignore
                declaration.id.typeAnnotation = undefined
            })
        },
        // Remove type annotations from class properties
        ClassProperty(path) {
            if (
                path.node.typeAnnotation &&
                //@ts-ignore
                path.node.typeAnnotation.typeParameters
            ) {
                //@ts-ignore
                path.node.typeAnnotation.typeParameters = undefined
            }
            if (path.node.typeAnnotation) {
                path.node.typeAnnotation = undefined
            }
        },
        // Remove type annotations from class methods
        ClassMethod(path) {
            if (path.node.typeParameters) {
                path.node.typeParameters = undefined
            }
            path.node.params.forEach((param) => {
                //@ts-ignore
                param.typeAnnotation = undefined
            })
            if (path.node.returnType) {
                path.node.returnType = undefined
            }
        },
        // Remove type assertions
        TSAsExpression(path) {
            path.replaceWith(path.node.expression)
        },
        // Resolve imports
        ImportDeclaration(path) {
            const importSource = path.node.source.value
            if (importSource !== "lingo3d") return
            const imports = path.node.specifiers.map((specifier) => {
                //@ts-ignore
                const importedName = specifier.imported.name
                const localName = specifier.local.name
                return `${localName} = $lingo3d.${importedName}`
            })
            path.replaceWithMultiple(
                imports.map((importCode) => parse(importCode).program.body[0])
            )
        }
    })
    return generate(ast).code
}
