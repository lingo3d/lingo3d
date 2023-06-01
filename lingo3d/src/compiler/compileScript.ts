export default async (script: string) => {
    const { parsers } = await import("prettier/parser-typescript")
    //@ts-ignore
    const result = parsers.typescript.parse(script)
    console.log(result)
    // parser.parsers.typescript.parse(script.)
}