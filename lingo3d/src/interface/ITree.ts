import IModel, { modelDefaults, modelSchema } from "./IModel"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ITree extends IModel {
    preset: string
}

export const treeSchema: Required<ExtractProps<ITree>> = {
    ...modelSchema,
    preset: String
}

export const treeDefaults = extendDefaults<ITree>([modelDefaults], {
    preset: "tree1",
    scale: 4
})
