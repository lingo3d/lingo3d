const nonEditorSchemaSet = new Set<string>()
export default nonEditorSchemaSet

export const hideSchema = (props: Array<string>) => {
    for (const prop of props) nonEditorSchemaSet.add(prop)
}
