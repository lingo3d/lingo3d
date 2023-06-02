import { setScriptCompile } from "../states/useScriptCompile"

export default async (script: string) => {
    setScriptCompile({ raw: script })

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
                delete path.node.typeParameters
            }
            // path.node.params.forEach((param) => {
            //     delete param.typeAnnotation
            // })
            // if (path.node.returnType) {
            //     delete path.node.returnType
            // }
        },
        // Remove type annotations from function expressions
        ArrowFunctionExpression(path) {
            if (path.node.typeParameters) {
                delete path.node.typeParameters
            }
            // path.node.params.forEach((param) => {
            //     delete param.typeAnnotation
            // })
            // if (path.node.returnType) {
            //     delete path.node.returnType
            // }
        },
        // Remove type annotations from variable declarations
        VariableDeclaration(path) {
            path.node.declarations.forEach((declaration) => {
                //@ts-ignore
                delete declaration.id.typeAnnotation
            })
        },
        // Remove type annotations from class properties
        ClassProperty(path) {
            if (path.node.typeAnnotation) {
                delete path.node.typeAnnotation
            }
        },
        // Remove type annotations from class methods
        ClassMethod(path) {
            path.node.params.forEach((param) => {
                //@ts-ignore
                delete param.typeAnnotation
            })
            if (path.node.returnType) {
                delete path.node.returnType
            }
        }
    })

    const transformedCode = generate(ast)
    console.log(transformedCode.code)
}
